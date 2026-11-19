import { Suspense } from "react";
import UsersList from "@/src/components/dashboard/users/users-list";
import UsersToolbar from "@/src/components/dashboard/users/users-toolbar";
import PageHeader from "@/src/components/ui/page-header";
import Pagination from "@/src/components/ui/pagination";
import { hasPermission, requirePermission } from "@/src/lib/dal";
import { countAdmins, listUsers } from "@/src/lib/db/users";
import { getAvailableUserActions } from "@/src/lib/user-guards";
import {
  userListParamsSchema,
  type UserListParams,
} from "@/src/lib/validations/user-management.schema";

type UsersPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Pagination must carry the filters; `page` only appears when it matters.
function buildHref(params: UserListParams) {
  return (page: number) => {
    const search = new URLSearchParams();

    if (params.q) search.set("q", params.q);
    if (params.role) search.set("role", params.role);
    if (params.status) search.set("status", params.status);
    if (page > 1) search.set("page", String(page));

    const query = search.toString();
    return query ? `?${query}` : "?";
  };
}

const Users = ({ searchParams }: UsersPageProps) => {
  return (
    <div className="flex flex-col gap-section-dashboard px-gutter py-section-dashboard">
      <PageHeader
        title="کاربران"
        description="مدیریت نقش‌ها، وضعیت دسترسی و نشست‌های کاربران سامانه"
      />
      <Suspense fallback={null}>
        <UsersContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

async function UsersContent({ searchParams }: UsersPageProps) {
  // Layouts are not re-run on client navigation, so the page checks its own
  // permission as well.
  const session = await requirePermission({ user: ["list"] });

  // Every field falls back to a safe default, so this cannot throw on a
  // hand-written URL.
  const params = userListParamsSchema.parse(await searchParams);

  const [result, adminCount, canBan, canSetRole, canRevokeSessions] =
    await Promise.all([
      listUsers(params),
      countAdmins(),
      hasPermission({ user: ["ban"] }),
      hasPermission({ user: ["set-role"] }),
      hasPermission({ session: ["revoke"] }),
    ]);

  const users = result.users.map((user) => ({
    ...user,
    actions: getAvailableUserActions({
      actor: { id: session.user.id },
      target: { id: user.id, role: user.role, banned: user.banned },
      adminCount,
      abilities: { canBan, canSetRole, canRevokeSessions },
    }),
  }));

  return (
    <>
      <UsersToolbar
        defaultValues={{
          q: params.q,
          role: params.role,
          status: params.status,
        }}
      />
      <UsersList users={users} />
      <Pagination
        page={result.page}
        pageCount={result.pageCount}
        getHref={buildHref(params)}
      />
    </>
  );
}

export default Users;
