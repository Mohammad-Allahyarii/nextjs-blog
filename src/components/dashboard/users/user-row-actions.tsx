"use client";

import { useActionState, useState } from "react";
import BanUserDialog from "@/src/components/dashboard/users/ban-user-dialog";
import ChangeRoleDialog from "@/src/components/dashboard/users/change-role-dialog";
import ConfirmDialog from "@/src/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuItem,
} from "@/src/components/ui/dropdown-menu";
import { useToast } from "@/src/components/ui/toast";
import {
  banUserAction,
  revokeUserSessionsAction,
  setUserRoleAction,
  unbanUserAction,
} from "@/src/app/dashboard/admin/users/actions";
import {
  initialUserActionState,
  type UserActionState,
  type UserListItem,
} from "@/src/lib/types/user-management.types";
import { cn } from "@/src/lib/utils/ui.utils";

export type UserDialogKind = "ban" | "role" | "unban" | "revoke";

type UserDialogProps = {
  user: UserListItem;
  onClose: () => void;
};

// Each dialog owns its useActionState and is mounted only while open, so a
// previous error or success can never leak into the next attempt.
function BanDialog({ user, onClose }: UserDialogProps) {
  const { toast } = useToast();

  const [state, formAction, pending] = useActionState(
    async (previous: UserActionState, formData: FormData) => {
      const result = await banUserAction(previous, formData);

      if (result.status === "success" && result.message) {
        toast({ title: result.message, variant: "success" });
        onClose();
      }

      return result;
    },
    initialUserActionState,
  );

  return (
    <BanUserDialog
      open
      onClose={onClose}
      user={user}
      action={formAction}
      pending={pending}
      error={state.status === "error" ? state.message : undefined}
      fieldErrors={state.fieldErrors}
    />
  );
}

function RoleDialog({ user, onClose }: UserDialogProps) {
  const { toast } = useToast();

  const [state, formAction, pending] = useActionState(
    async (previous: UserActionState, formData: FormData) => {
      const result = await setUserRoleAction(previous, formData);

      if (result.status === "success" && result.message) {
        toast({ title: result.message, variant: "success" });
        onClose();
      }

      return result;
    },
    initialUserActionState,
  );

  return (
    <ChangeRoleDialog
      open
      onClose={onClose}
      user={user}
      action={formAction}
      pending={pending}
      error={state.status === "error" ? state.message : undefined}
      fieldErrors={state.fieldErrors}
    />
  );
}

function UserConfirmDialog({
  user,
  onClose,
  title,
  description,
  confirmLabel,
  variant,
  run,
}: UserDialogProps & {
  title: string;
  description: string;
  confirmLabel: string;
  variant?: "default" | "danger";
  run: (
    previousState: UserActionState,
    formData: FormData,
  ) => Promise<UserActionState>;
}) {
  const { toast } = useToast();

  const [state, formAction, pending] = useActionState(
    async (previous: UserActionState, formData: FormData) => {
      const result = await run(previous, formData);

      if (result.status === "success" && result.message) {
        toast({ title: result.message, variant: "success" });
        onClose();
      }

      return result;
    },
    initialUserActionState,
  );

  return (
    <ConfirmDialog
      open
      onClose={onClose}
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      variant={variant}
      action={formAction}
      userId={user.id}
      pending={pending}
      error={state.status === "error" ? state.message : undefined}
    />
  );
}

export function UserActionDialogs({
  user,
  activeDialog,
  onClose,
}: UserDialogProps & { activeDialog: UserDialogKind | null }) {
  if (activeDialog === "ban") {
    return <BanDialog user={user} onClose={onClose} />;
  }

  if (activeDialog === "role") {
    return <RoleDialog user={user} onClose={onClose} />;
  }

  if (activeDialog === "unban") {
    return (
      <UserConfirmDialog
        user={user}
        onClose={onClose}
        title={`رفع بن ${user.name}`}
        description="دسترسی کاربر به داشبورد و نوشتن مطلب دوباره برقرار می‌شود."
        confirmLabel="رفع بن"
        run={unbanUserAction}
      />
    );
  }

  if (activeDialog === "revoke") {
    return (
      <UserConfirmDialog
        user={user}
        onClose={onClose}
        title={`قطع نشست‌های ${user.name}`}
        description="کاربر از همه‌ی دستگاه‌ها خارج می‌شود و باید دوباره وارد شود."
        confirmLabel="قطع نشست‌ها"
        variant="danger"
        run={revokeUserSessionsAction}
      />
    );
  }

  return null;
}

type UserRowActionsProps = {
  user: UserListItem;
  className?: string;
};

export default function UserRowActions({
  user,
  className,
}: UserRowActionsProps) {
  const [activeDialog, setActiveDialog] = useState<UserDialogKind | null>(null);
  const actions = user.actions;

  // Nothing to do for this row (for example a moderator): no menu at all.
  const hasAnyAction = Boolean(
    actions &&
      (actions.canBan ||
        actions.canUnban ||
        actions.canSetRole ||
        actions.canRevokeSessions),
  );

  if (!actions || !hasAnyAction) return null;

  return (
    <div className={cn("inline-flex", className)}>
      <DropdownMenu label={`عملیات ${user.name}`}>
        <DropdownMenuItem href={`/dashboard/admin/users/${user.id}`}>
          مشاهده جزئیات
        </DropdownMenuItem>

        {actions.canBan ? (
          <DropdownMenuItem variant="danger" onClick={() => setActiveDialog("ban")}>
            بن کردن
          </DropdownMenuItem>
        ) : null}

        {actions.canUnban ? (
          <DropdownMenuItem onClick={() => setActiveDialog("unban")}>
            رفع بن
          </DropdownMenuItem>
        ) : null}

        {actions.canSetRole ? (
          <DropdownMenuItem onClick={() => setActiveDialog("role")}>
            تغییر نقش
          </DropdownMenuItem>
        ) : null}

        {actions.canRevokeSessions ? (
          <DropdownMenuItem onClick={() => setActiveDialog("revoke")}>
            قطع نشست‌ها
          </DropdownMenuItem>
        ) : null}
      </DropdownMenu>

      <UserActionDialogs
        user={user}
        activeDialog={activeDialog}
        onClose={() => setActiveDialog(null)}
      />
    </div>
  );
}
