import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export type Role = "admin" | "user";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
};

const toRole = (r: unknown): Role => (r === "admin" ? "admin" : "user");

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

export async function isAdmin() {
  return (await getRole()) === "admin";
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (toRole(session.user.role) !== "admin") redirect("/");
  return session;
}

export async function requireUser() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!session.user.firstName || !session.user.lastName) redirect("/onboarding");
  return session.user;
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await getSession();
  if (!session) return null;

  const { id, name, email, image, role } = session.user;
  return { id, name, email, image: image ?? null, role: toRole(role) };
});