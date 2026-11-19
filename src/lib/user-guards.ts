// Pure rules for the user-management actions.
//
// This module is the single source of truth: the UI asks it which buttons to
// render, and the Server Actions ask it whether a request may go through.
// It must stay free of server-only imports so the browser can use it too.

import type { Role } from "@/src/lib/permissions";

export type UserAction = "ban" | "unban" | "set-role" | "revoke-sessions";

type GuardInput = {
  action: UserAction;
  actor: { id: string };
  // `banned` is the EFFECTIVE ban status, not the raw database column.
  target: { id: string; role: Role; banned: boolean };
  newRole?: Role;
  adminCount: number;
};

type GuardResult = { ok: true } | { ok: false; reason: string };

const reject = (reason: string): GuardResult => ({ ok: false, reason });
const allow: GuardResult = { ok: true };

export function checkUserAction(input: GuardInput): GuardResult {
  const { action, actor, target, newRole, adminCount } = input;

  switch (action) {
    case "ban":
      if (actor.id === target.id) return reject("نمی‌توانید خودتان را بن کنید.");
      if (target.role === "admin")
        return reject("بن کردن مدیر مجاز نیست. ابتدا نقش او را تغییر دهید.");
      if (target.banned) return reject("این کاربر قبلاً بن شده است.");
      return allow;

    case "unban":
      if (!target.banned) return reject("این کاربر بن نیست.");
      return allow;

    case "set-role":
      if (!newRole) return reject("نقش نامعتبر است.");
      if (actor.id === target.id)
        return reject("نمی‌توانید نقش خودتان را تغییر دهید.");
      if (newRole === target.role)
        return reject("کاربر از قبل همین نقش را دارد.");
      if (target.role === "admin" && newRole !== "admin" && adminCount <= 1)
        return reject("آخرین مدیر سامانه را نمی‌توان تنزل داد.");
      return allow;

    case "revoke-sessions":
      if (actor.id === target.id)
        return reject("برای خروج از حساب خودتان از دکمه‌ی خروج استفاده کنید.");
      return allow;
  }
}

export function getAvailableUserActions(input: {
  actor: { id: string };
  target: { id: string; role: Role; banned: boolean };
  adminCount: number;
  abilities: {
    canBan: boolean;
    canSetRole: boolean;
    canRevokeSessions: boolean;
  };
}): {
  canBan: boolean;
  canUnban: boolean;
  canSetRole: boolean;
  canRevokeSessions: boolean;
} {
  const { actor, target, adminCount, abilities } = input;
  const allowed = (action: UserAction) =>
    checkUserAction({ action, actor, target, adminCount }).ok;

  return {
    canBan: abilities.canBan && allowed("ban"),
    canUnban: abilities.canBan && allowed("unban"),
    // Changing the role has no fixed target role yet, so only the self rule
    // can be applied here; the action re-checks the rest.
    canSetRole: abilities.canSetRole && actor.id !== target.id,
    canRevokeSessions:
      abilities.canRevokeSessions && allowed("revoke-sessions"),
  };
}
