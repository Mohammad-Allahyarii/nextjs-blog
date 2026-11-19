import UserRoleBadge from "@/src/components/dashboard/users/user-role-badge";
import UserRowActions from "@/src/components/dashboard/users/user-row-actions";
import UserStatusBadge from "@/src/components/dashboard/users/user-status-badge";
import Avatar from "@/src/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import type { UserListItem } from "@/src/lib/types/user-management.types";
import { formatDate } from "@/src/lib/utils/format-date";
import { cn } from "@/src/lib/utils/ui.utils";

type UsersTableProps = {
  users: UserListItem[];
  className?: string;
};

export default function UsersTable({ users, className }: UsersTableProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-card border border-border bg-surface shadow-card",
        className,
      )}
    >
      <Table caption="فهرست کاربران">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[38%]">کاربر</TableHead>
            <TableHead>نقش</TableHead>
            <TableHead>وضعیت</TableHead>
            <TableHead>تاریخ عضویت</TableHead>
            <TableHead className="text-end">
              <span className="sr-only">عملیات</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar name={user.name} src={user.image} />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-body-sm font-medium text-foreground">
                      {user.name}
                    </span>
                    <span
                      dir="ltr"
                      className="truncate text-label text-muted-foreground"
                    >
                      {user.email}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <UserRoleBadge role={user.role} />
              </TableCell>
              <TableCell>
                <UserStatusBadge
                  banned={user.banned}
                  banExpires={user.banExpires}
                />
              </TableCell>
              <TableCell className="whitespace-nowrap text-body-sm text-muted-foreground">
                {formatDate(user.createdAt)}
              </TableCell>
              <TableCell className="text-end">
                <div className="flex justify-end">
                  <UserRowActions user={user} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
