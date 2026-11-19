import { z } from "zod";
import {
  BAN_DURATIONS,
  BAN_REASON_MAX_LENGTH,
  type BanDuration,
} from "@/src/lib/constants/user-management.constants";
import { ROLES, type Role } from "@/src/lib/permissions";

// Everything below comes from the browser (FormData or searchParams) and is
// treated as untrusted. Invalid list filters fall back to a safe default
// instead of throwing, so a hand-written URL can never break the page.

const KNOWN_ROLES: ReadonlySet<string> = new Set<string>(ROLES);
const KNOWN_DURATIONS: ReadonlySet<string> = new Set<string>(BAN_DURATIONS);

const isRole = (value: unknown): value is Role =>
  typeof value === "string" && KNOWN_ROLES.has(value);

const isBanDuration = (value: unknown): value is BanDuration =>
  typeof value === "string" && KNOWN_DURATIONS.has(value);

// A repeated query parameter (?role=admin&role=user) resolves to its first value.
const firstValue = (value: unknown): string | undefined => {
  if (Array.isArray(value)) {
    const [first] = value;
    return typeof first === "string" ? first : undefined;
  }

  return typeof value === "string" ? value : undefined;
};

const emptyToUndefined = (value: string | undefined): string | undefined =>
  value ? value : undefined;

export const userIdSchema = z
  .string({ error: "کاربر نامعتبر است." })
  .trim()
  .min(1, { error: "کاربر نامعتبر است." })
  .max(64, { error: "کاربر نامعتبر است." });

export const userListParamsSchema = z.object({
  q: z
    .preprocess(
      firstValue,
      z.string().trim().max(100).optional().catch(undefined),
    )
    .transform(emptyToUndefined),
  role: z.preprocess(
    firstValue,
    z
      .custom<Role>(isRole, { error: "نقش نامعتبر است." })
      .optional()
      .catch(undefined),
  ),
  status: z.preprocess(
    firstValue,
    z.enum(["active", "banned"]).optional().catch(undefined),
  ),
  page: z.preprocess(
    firstValue,
    z.coerce.number().int().min(1).max(10000).catch(1),
  ),
});

export type UserListParams = z.infer<typeof userListParamsSchema>;

export const banUserSchema = z.object({
  userId: userIdSchema,
  reason: z.preprocess(
    (value) => {
      if (typeof value !== "string") return undefined;
      return value.trim().length > 0 ? value : undefined;
    },
    z
      .string()
      .trim()
      .max(BAN_REASON_MAX_LENGTH, {
        error: "توضیح نمی‌تواند بیشتر از ۲۰۰ حرف باشد.",
      })
      .optional(),
  ),
  duration: z.preprocess(
    firstValue,
    z.custom<BanDuration>(isBanDuration, { error: "مدت بن نامعتبر است." }),
  ),
});

export const setRoleSchema = z.object({
  userId: userIdSchema,
  role: z.preprocess(
    firstValue,
    z.custom<Role>(isRole, { error: "نقش نامعتبر است." }),
  ),
});

export const unbanUserSchema = z.object({
  userId: userIdSchema,
});

export const revokeSessionsSchema = z.object({
  userId: userIdSchema,
});
