import type { Role } from "@/src/lib/permissions";

export type UserListItem = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  // Effective ban status: an expired temporary ban counts as not banned.
  banned: boolean;
  banReason: string | null;
  banExpires: string | null;
  createdAt: string;
  // Filled in per row by the page; the row menu renders only these actions.
  actions?: UserAvailableActions;
};

export type UserAvailableActions = {
  canBan: boolean;
  canUnban: boolean;
  canSetRole: boolean;
  canRevokeSessions: boolean;
};

export type UserAbilities = {
  canView: boolean;
  canBan: boolean;
  canSetRole: boolean;
  canRevokeSessions: boolean;
};

export type UserActionHandler = (user: UserListItem) => void;

export type UserActionCallbacks = {
  onBan?: UserActionHandler;
  onUnban?: UserActionHandler;
  onChangeRole?: UserActionHandler;
  onRevokeSessions?: UserActionHandler;
};

export type UserActionFieldName = "reason" | "duration" | "role";

export type UserActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<UserActionFieldName, string[]>>;
};

export const initialUserActionState: UserActionState = { status: "idle" };
