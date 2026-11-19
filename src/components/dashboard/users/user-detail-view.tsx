"use client";

import { useState } from "react";
import {
  UserActionDialogs,
  type UserDialogKind,
} from "@/src/components/dashboard/users/user-row-actions";
import UserRoleBadge from "@/src/components/dashboard/users/user-role-badge";
import UserStatusBadge from "@/src/components/dashboard/users/user-status-badge";
import { Button } from "@/src/components/common/Button";
import Avatar from "@/src/components/ui/avatar";
import Card from "@/src/components/ui/card";
import { roleLabels } from "@/src/lib/types/user.types";
import type { UserListItem } from "@/src/lib/types/user-management.types";
import { formatDate } from "@/src/lib/utils/format-date";
import { cn } from "@/src/lib/utils/ui.utils";

type UserDetailViewProps = {
  user: UserListItem;
  className?: string;
};

function InfoRow({
  label,
  value,
  ltr = false,
}: {
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-label text-subtle-foreground">{label}</dt>
      <dd className="text-body-sm text-foreground" dir={ltr ? "ltr" : undefined}>
        {value}
      </dd>
    </div>
  );
}

export default function UserDetailView({
  user,
  className,
}: UserDetailViewProps) {
  const [activeDialog, setActiveDialog] = useState<UserDialogKind | null>(null);
  const actions = user.actions;

  const hasAnyAction = Boolean(
    actions &&
      (actions.canBan ||
        actions.canUnban ||
        actions.canSetRole ||
        actions.canRevokeSessions),
  );

  return (
    <div className={cn("flex flex-col gap-grid", className)}>
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar name={user.name} src={user.image} size="lg" />
          <div className="flex flex-col gap-2 text-start">
            <p className="text-headline-md text-foreground">{user.name}</p>
            <p dir="ltr" className="text-body-sm text-muted-foreground">
              {user.email}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <UserRoleBadge role={user.role} />
              <UserStatusBadge
                banned={user.banned}
                banExpires={user.banExpires}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card title="اطلاعات حساب">
        <dl className="grid gap-4 sm:grid-cols-2">
          <InfoRow label="شناسه" value={user.id} ltr />
          <InfoRow label="ایمیل" value={user.email} ltr />
          <InfoRow label="نقش" value={roleLabels[user.role]} />
          <InfoRow label="تاریخ عضویت" value={formatDate(user.createdAt)} />
        </dl>
      </Card>

      {user.banned ? (
        <Card title="وضعیت بن">
          <dl className="grid gap-4 sm:grid-cols-2">
            <InfoRow label="دلیل" value={user.banReason ?? "بدون توضیح"} />
            <InfoRow
              label="پایان بن"
              value={user.banExpires ? formatDate(user.banExpires) : "دائمی"}
            />
          </dl>
        </Card>
      ) : null}

      {actions && hasAnyAction ? (
        <Card title="عملیات">
          <div className="flex flex-wrap items-center gap-2">
            {actions.canBan ? (
              <Button
                variant="danger"
                onClick={() => setActiveDialog("ban")}
              >
                بن کردن
              </Button>
            ) : null}

            {actions.canUnban ? (
              <Button
                variant="secondary"
                onClick={() => setActiveDialog("unban")}
              >
                رفع بن
              </Button>
            ) : null}

            {actions.canSetRole ? (
              <Button variant="outline" onClick={() => setActiveDialog("role")}>
                تغییر نقش
              </Button>
            ) : null}

            {actions.canRevokeSessions ? (
              <Button
                variant="outline"
                onClick={() => setActiveDialog("revoke")}
              >
                قطع نشست‌ها
              </Button>
            ) : null}
          </div>
        </Card>
      ) : null}

      <UserActionDialogs
        user={user}
        activeDialog={activeDialog}
        onClose={() => setActiveDialog(null)}
      />
    </div>
  );
}
