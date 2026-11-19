"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/src/lib/auth";
import { logAudit } from "@/src/lib/audit";
import { BAN_DURATION_SECONDS } from "@/src/lib/constants/user-management.constants";
import { requirePermission } from "@/src/lib/dal";
import { countAdmins, getUserById } from "@/src/lib/db/users";
import type { Role } from "@/src/lib/permissions";
import type {
  UserActionFieldName,
  UserActionState,
} from "@/src/lib/types/user-management.types";
import { checkUserAction, type UserAction } from "@/src/lib/user-guards";
import {
  banUserSchema,
  revokeSessionsSchema,
  setRoleSchema,
  unbanUserSchema,
} from "@/src/lib/validations/user-management.schema";

const GENERIC_ERROR = "انجام عملیات ممکن نشد. لطفاً دوباره تلاش کنید.";
const INVALID_INPUT = "اطلاعات واردشده نامعتبر است.";
const USER_NOT_FOUND = "کاربر پیدا نشد.";

function invalidInput(
  fieldErrors: Partial<Record<UserActionFieldName, string[]>>,
): UserActionState {
  const hasFieldError = Object.values(fieldErrors).some(
    (messages) => (messages?.length ?? 0) > 0,
  );

  return {
    status: "error",
    fieldErrors: hasFieldError ? fieldErrors : undefined,
    message: hasFieldError ? undefined : INVALID_INPUT,
  };
}

// Internal errors stay on the server: the browser only sees a generic message.
function internalFailure(scope: string, error: unknown): UserActionState {
  console.error(`[users] ${scope} failed`, error);
  return { status: "error", message: GENERIC_ERROR };
}

function revalidateUserPages(userId: string) {
  revalidatePath("/dashboard/admin/users");
  revalidatePath(`/dashboard/admin/users/${userId}`);
}

// Loads the target fresh and applies the shared guards, so a forged FormData
// payload cannot skip a rule the UI would have hidden.
async function resolveTarget(
  action: UserAction,
  actorId: string,
  userId: string,
  newRole?: Role,
): Promise<
  | { ok: true; role: string; banned: boolean }
  | { ok: false; state: UserActionState }
> {
  const target = await getUserById(userId);
  if (!target) return { ok: false, state: { status: "error", message: USER_NOT_FOUND } };

  const adminCount = await countAdmins();
  const guard = checkUserAction({
    action,
    actor: { id: actorId },
    target: { id: target.id, role: target.role, banned: target.banned },
    newRole,
    adminCount,
  });

  if (!guard.ok) return { ok: false, state: { status: "error", message: guard.reason } };

  return { ok: true, role: target.role, banned: target.banned };
}

export async function banUserAction(
  _previousState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const session = await requirePermission({ user: ["ban"] });

  const parsed = banUserSchema.safeParse({
    userId: formData.get("userId"),
    reason: formData.get("reason"),
    duration: formData.get("duration"),
  });
  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return invalidInput({
      reason: fieldErrors.reason,
      duration: fieldErrors.duration,
    });
  }

  const { userId, reason, duration } = parsed.data;

  const target = await resolveTarget("ban", session.user.id, userId);
  if (!target.ok) return target.state;

  try {
    await auth.api.banUser({
      headers: await headers(),
      body: {
        userId,
        banReason: reason ?? "بدون توضیح",
        ...(duration === "permanent"
          ? {}
          : { banExpiresIn: BAN_DURATION_SECONDS[duration] }),
      },
    });
  } catch (error) {
    return internalFailure("ban", error);
  }

  // Audited only after the mutation succeeded. No email or name in meta.
  await logAudit({
    actorId: session.user.id,
    action: "user:ban",
    targetType: "user",
    targetId: userId,
    meta:
      duration === "permanent"
        ? { reason: reason ?? null, permanent: true }
        : { reason: reason ?? null, durationSeconds: BAN_DURATION_SECONDS[duration] },
  });

  revalidateUserPages(userId);
  return { status: "success", message: "کاربر بن شد." };
}

export async function unbanUserAction(
  _previousState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const session = await requirePermission({ user: ["ban"] });

  const parsed = unbanUserSchema.safeParse({
    userId: formData.get("userId"),
  });
  if (!parsed.success) return invalidInput({});

  const { userId } = parsed.data;

  const target = await resolveTarget("unban", session.user.id, userId);
  if (!target.ok) return target.state;

  try {
    await auth.api.unbanUser({
      headers: await headers(),
      body: { userId },
    });
  } catch (error) {
    return internalFailure("unban", error);
  }

  await logAudit({
    actorId: session.user.id,
    action: "user:unban",
    targetType: "user",
    targetId: userId,
    meta: {},
  });

  revalidateUserPages(userId);
  return { status: "success", message: "بن کاربر برداشته شد." };
}

export async function setUserRoleAction(
  _previousState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const session = await requirePermission({ user: ["set-role"] });

  const parsed = setRoleSchema.safeParse({
    userId: formData.get("userId"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return invalidInput({ role: fieldErrors.role });
  }

  const { userId, role } = parsed.data;

  const target = await resolveTarget("set-role", session.user.id, userId, role);
  if (!target.ok) return target.state;

  try {
    await auth.api.setRole({
      headers: await headers(),
      body: { userId, role },
    });
  } catch (error) {
    return internalFailure("set-role", error);
  }

  await logAudit({
    actorId: session.user.id,
    action: "user:set-role",
    targetType: "user",
    targetId: userId,
    meta: { from: target.role, to: role },
  });

  revalidateUserPages(userId);
  return { status: "success", message: "نقش کاربر تغییر کرد." };
}

export async function revokeUserSessionsAction(
  _previousState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const session = await requirePermission({ session: ["revoke"] });

  const parsed = revokeSessionsSchema.safeParse({
    userId: formData.get("userId"),
  });
  if (!parsed.success) return invalidInput({});

  const { userId } = parsed.data;

  const target = await resolveTarget("revoke-sessions", session.user.id, userId);
  if (!target.ok) return target.state;

  try {
    await auth.api.revokeUserSessions({
      headers: await headers(),
      body: { userId },
    });
  } catch (error) {
    return internalFailure("revoke-sessions", error);
  }

  await logAudit({
    actorId: session.user.id,
    action: "user:revoke-sessions",
    targetType: "user",
    targetId: userId,
    meta: {},
  });

  revalidateUserPages(userId);
  return { status: "success", message: "نشست‌های کاربر بسته شد." };
}
