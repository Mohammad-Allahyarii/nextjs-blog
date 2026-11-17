import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { ROLES, type Role } from "./permissions";
import type { statement } from "./permissions";

export type { Role };

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
};

// Permissions are derived from the statement in permissions.ts, so a typo in a
// resource or an action name is a type error instead of a silent "denied".
type Statements = typeof statement;

export type PermissionInput = {
  [Resource in keyof Statements]?: Array<Statements[Resource][number]>;
};

const KNOWN_ROLES = new Set<string>(ROLES);

// Unknown values (null, undefined, an unknown string) fall back to the least
// privileged role: a missing or unexpected column must never widen access.
const toRole = (value: unknown): Role =>
  typeof value === "string" && KNOWN_ROLES.has(value) ? (value as Role) : "user";

// Cached per request. Fails closed: any error means "no session".
export const getSession = cache(async () => {
  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch (e) {
    console.error("getSession failed:", e instanceof Error ? e.message : "unknown");
    return null;
  }
});

export async function getRole(): Promise<Role | null> {
  const session = await getSession();
  return session ? toRole(session.user.role) : null;
}

// Answers "may the signed-in user do this?" through the admin plugin, which
// resolves the role stored on the user row. No session means no permission.
export async function hasPermission(
  permissions: PermissionInput,
): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;

  try {
    const result = await auth.api.userHasPermission({
      headers: await headers(),
      body: { permissions },
    });

    return result.success === true;
  } catch (e) {
    console.error(
      "hasPermission failed:",
      e instanceof Error ? e.message : "unknown",
    );
    return false;
  }
}

// Guard for pages, layouts and server actions. Layouts do not re-run on client
// navigation, so every page behind a layout must call this as well.
export async function requirePermission(permissions: PermissionInput) {
  const session = await getSession();
  if (!session) redirect("/auth");
  if (!(await hasPermission(permissions))) redirect("/403");

  return session;
}

export async function requireUser() {
  const session = await getSession();
  if (!session) redirect("/auth");
  if (!session.user.firstName || !session.user.lastName) redirect("/onboarding");
  return session.user;
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await getSession();
  if (!session) return null;

  const { id, name, email, image, role } = session.user;
  return { id, name, email, image: image ?? null, role: toRole(role) };
});
