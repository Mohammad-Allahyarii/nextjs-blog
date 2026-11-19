import "server-only";

import type { Prisma } from "@/src/generated/prisma/client";
import { USERS_PAGE_SIZE } from "@/src/lib/constants/user-management.constants";
import { db } from "@/src/lib/db";
import { ROLES, type Role } from "@/src/lib/permissions";
import type { UserListItem } from "@/src/lib/types/user-management.types";

const KNOWN_ROLES: ReadonlySet<string> = new Set<string>(ROLES);

const isRole = (value: string | null | undefined): value is Role =>
  typeof value === "string" && KNOWN_ROLES.has(value);

// A missing or unexpected role must never widen access.
const toRole = (value: string | null | undefined): Role =>
  isRole(value) ? value : "user";

// Never select more columns than the management screens render.
const userSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
  role: true,
  banned: true,
  banReason: true,
  banExpires: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

type SelectedUser = Prisma.UserGetPayload<{ select: typeof userSelect }>;

// Better Auth only clears an expired temporary ban at the next sign-in, so the
// stored row can be banned=true while the ban has already run out.
const hasEffectiveBan = (
  user: { banned: boolean | null; banExpires: Date | null },
  now: Date,
): boolean =>
  user.banned === true &&
  (user.banExpires === null || user.banExpires.getTime() > now.getTime());

const toListItem = (user: SelectedUser, now: Date): UserListItem => {
  const banned = hasEffectiveBan(user, now);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: toRole(user.role),
    banned,
    banReason: banned ? user.banReason : null,
    banExpires:
      banned && user.banExpires ? user.banExpires.toISOString() : null,
    createdAt: user.createdAt.toISOString(),
  };
};

export type UserListFilters = {
  q?: string;
  role?: Role;
  status?: "active" | "banned";
  page: number;
};

export type UserListResult = {
  users: UserListItem[];
  total: number;
  page: number;
  pageCount: number;
};

export async function listUsers(
  filters: UserListFilters,
): Promise<UserListResult> {
  const now = new Date();

  // NOT is avoided on purpose: banned is nullable in the schema, and a NULL
  // column would silently drop out of a negation.
  const bannedWhere: Prisma.UserWhereInput = {
    banned: true,
    OR: [{ banExpires: null }, { banExpires: { gt: now } }],
  };
  const activeWhere: Prisma.UserWhereInput = {
    OR: [
      { banned: null },
      { banned: false },
      { banned: true, banExpires: { lte: now } },
    ],
  };
  const searchWhere: Prisma.UserWhereInput = filters.q
    ? {
        OR: [
          { name: { contains: filters.q, mode: "insensitive" } },
          { email: { contains: filters.q, mode: "insensitive" } },
        ],
      }
    : {};

  const where: Prisma.UserWhereInput = {
    AND: [
      searchWhere,
      filters.role ? { role: filters.role } : {},
      filters.status === "banned"
        ? bannedWhere
        : filters.status === "active"
          ? activeWhere
          : {},
    ],
  };

  // The count runs first so an out-of-range page can be clamped before the
  // rows are read, instead of showing an empty page.
  const total = await db.user.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / USERS_PAGE_SIZE));
  const page = Math.min(Math.max(1, filters.page), pageCount);

  const rows = await db.user.findMany({
    where,
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    take: USERS_PAGE_SIZE,
    skip: (page - 1) * USERS_PAGE_SIZE,
    select: userSelect,
  });

  return {
    users: rows.map((row) => toListItem(row, now)),
    total,
    page,
    pageCount,
  };
}

export async function getUserById(id: string): Promise<UserListItem | null> {
  const user = await db.user.findUnique({ where: { id }, select: userSelect });

  return user ? toListItem(user, new Date()) : null;
}

export async function countAdmins(): Promise<number> {
  return db.user.count({ where: { role: "admin" } });
}
