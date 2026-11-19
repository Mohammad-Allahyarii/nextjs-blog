import UserRoleBadge from "@/src/components/dashboard/users/user-role-badge";
import UserRowActions from "@/src/components/dashboard/users/user-row-actions";
import UserStatusBadge from "@/src/components/dashboard/users/user-status-badge";
import Avatar from "@/src/components/ui/avatar";
import type { UserListItem } from "@/src/lib/types/user-management.types";
import { formatDate } from "@/src/lib/utils/format-date";
import { cn } from "@/src/lib/utils/ui.utils";

type UsersCardListProps = {
  users: UserListItem[];
  className?: string;
};

export default function UsersCardList({ users, className }: UsersCardListProps) {
  return (
    <ul className={cn("flex flex-col gap-3", className)}>
      {users.map((user) => (
        <li key={user.id}>
          <article className="rounded-card border border-border bg-surface p-card shadow-card">
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar name={user.name} src={user.image} />
                <div className="flex min-w-0 flex-col">
                  <p className="truncate text-body-md font-medium text-foreground">
                    {user.name}
                  </p>
                  <p
                    dir="ltr"
                    className="truncate text-label text-muted-foreground"
                  >
                    {user.email}
                  </p>
                </div>
              </div>
              <UserRowActions user={user} />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
              <UserRoleBadge role={user.role} />
              <UserStatusBadge
                banned={user.banned}
                banExpires={user.banExpires}
              />
              <span className="ms-auto text-label text-subtle-foreground">
                {formatDate(user.createdAt)}
              </span>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
