import UsersCardList from "@/src/components/dashboard/users/users-card-list";
import UsersTable from "@/src/components/dashboard/users/users-table";
import EmptyState from "@/src/components/ui/empty-state";
import UserIcon from "@/src/components/icons/user-icon";
import type { UserListItem } from "@/src/lib/types/user-management.types";
import { cn } from "@/src/lib/utils/ui.utils";

type UsersListProps = {
  users: UserListItem[];
  className?: string;
};

export default function UsersList({ users, className }: UsersListProps) {
  if (users.length === 0) {
    return (
      <EmptyState
        icon={<UserIcon className="size-6" />}
        title="کاربری پیدا نشد"
        description="عبارت جستجو یا فیلترها را تغییر دهید و دوباره تلاش کنید."
        className={className}
      />
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="hidden md:block">
        <UsersTable users={users} />
      </div>
      <div className="md:hidden">
        <UsersCardList users={users} />
      </div>
    </div>
  );
}
