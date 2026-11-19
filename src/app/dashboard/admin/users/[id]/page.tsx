import { notFound } from "next/navigation";
import { Suspense } from "react";
import UserDetailView from "@/src/components/dashboard/users/user-detail-view";
import PageHeader from "@/src/components/ui/page-header";
import Skeleton from "@/src/components/ui/skeleton";
import { hasPermission, requirePermission } from "@/src/lib/dal";
import { countAdmins, getUserById } from "@/src/lib/db/users";
import { getAvailableUserActions } from "@/src/lib/user-guards";
import { userIdSchema } from "@/src/lib/validations/user-management.schema";

type UserDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default function UserDetailPage({ params }: UserDetailPageProps) {
  return (
    <div className="flex flex-col gap-section-dashboard px-gutter py-section-dashboard">
      <PageHeader
        title="جزئیات کاربر"
        description="اطلاعات حساب، وضعیت دسترسی و عملیات مدیریتی"
      />
      <Suspense fallback={<UserDetailSkeleton />}>
        <UserDetailContent params={params} />
      </Suspense>
    </div>
  );
}

async function UserDetailContent({ params }: UserDetailPageProps) {
  const session = await requirePermission({ user: ["get"] });

  const { id } = await params;
  const parsedId = userIdSchema.safeParse(id);
  if (!parsedId.success) notFound();

  const user = await getUserById(parsedId.data);
  if (!user) notFound();

  const [adminCount, canBan, canSetRole, canRevokeSessions] = await Promise.all([
    countAdmins(),
    hasPermission({ user: ["ban"] }),
    hasPermission({ user: ["set-role"] }),
    hasPermission({ session: ["revoke"] }),
  ]);

  const viewUser = {
    ...user,
    actions: getAvailableUserActions({
      actor: { id: session.user.id },
      target: { id: user.id, role: user.role, banned: user.banned },
      adminCount,
      abilities: { canBan, canSetRole, canRevokeSessions },
    }),
  };

  return <UserDetailView user={viewUser} />;
}

function UserDetailSkeleton() {
  return (
    <div className="flex flex-col gap-grid">
      <div className="flex flex-col gap-4 rounded-card border border-border bg-surface p-card sm:flex-row sm:items-center">
        <Skeleton className="size-14 rounded-chip" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-5 w-28 rounded-chip" />
        </div>
      </div>
      <Skeleton className="h-40 w-full rounded-card" />
      <Skeleton className="h-28 w-full rounded-card" />
    </div>
  );
}
