// src/lib/permissions.ts
//
// Single source of truth for roles and permissions.
// This file is imported by BOTH the server (auth.ts) and the browser
// (auth-client.ts), so it must never import anything server-only.

import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
  userAc,
} from "better-auth/plugins/admin/access";

// Resource -> allowed actions. `as const` is required for type inference.
// `defaultStatements` keeps the plugin's built-in `user` and `session`
// resources (list, ban, set-role, revoke sessions, ...).
export const statement = {
  ...defaultStatements,
  // Gate for the whole /dashboard/admin area and its sidebar.
  adminPanel: ["access"],
  post: [
    "create",
    "update-own", // ownership itself must still be checked in code
    "update-any",
    "delete-own", // ownership itself must still be checked in code
    "delete-any",
    // Publish directly. Everyone else is published or queued depending on the
    // site-wide `requirePostApproval` setting (see SiteSetting in the schema).
    "publish",
    "review", // approve, reject, or take down a post
  ],
  comment: ["create", "moderate", "delete"],
  category: ["manage"],
  tag: ["manage"],
  settings: ["manage"],
  auditLog: ["read"],
} as const;

export const ac = createAccessControl(statement);

// Every role passed to the admin plugin REPLACES the plugin's built-in
// definition of that role, and roles do not inherit from each other.
// So each role below lists everything it can do, including the basics.

// Any signed-in user: can write posts and comment.
const user = ac.newRole({
  ...userAc.statements,
  comment: ["create"],
  post: ["create", "update-own", "delete-own"],
});

const moderator = ac.newRole({
  ...userAc.statements,
  adminPanel: ["access"],
  // Read-only access to the users list (action names come from defaultStatements).
  user: ["list", "get"],
  comment: ["create", "moderate", "delete"],
  post: ["create", "update-own", "delete-own", "review"],
});

const editor = ac.newRole({
  ...userAc.statements,
  adminPanel: ["access"],
  comment: ["create", "moderate", "delete"],
  post: [
    "create",
    "update-own",
    "update-any",
    "delete-own",
    "publish",
    "review",
  ],
  category: ["manage"],
  tag: ["manage"],
});

const admin = ac.newRole({
  ...adminAc.statements, // keep every built-in admin permission
  adminPanel: ["access"],
  comment: ["create", "moderate", "delete"],
  post: [
    "create",
    "update-own",
    "update-any",
    "delete-own",
    "delete-any",
    "publish",
    "review",
  ],
  category: ["manage"],
  tag: ["manage"],
  settings: ["manage"],
  auditLog: ["read"],
});

// The keys here are the exact strings stored in user.role.
export const roles = { user, moderator, editor, admin };

export type Role = keyof typeof roles;
export const ROLES = Object.keys(roles) as Role[];