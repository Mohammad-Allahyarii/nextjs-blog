import { Suspense } from "react";
import { BLOG_NAME } from "@/src/lib/constants/initial.constants";
import { getCurrentUser, requireUser } from "@/src/lib/dal";
import { adminOrUserRole } from "@/src/lib/utils/user.utils";
import NavList from "@/src/components/dashboard/layout/nav-list";
import UserCard from "@/src/components/dashboard/layout/user-card";

// The session read below cannot be part of a static shell, so this segment
// keeps blocking on the server instead of opting into instant navigation.
export const instant = false;

async function NavListWithRole() {
  const userRole = await adminOrUserRole();
  return <NavList role={userRole} />;
}

async function UserCardWithUser() {
  const user = await getCurrentUser();
  if (!user) return <h1>login reqiered</h1>;

  return <UserCard user={user} />;
}

const Dashboard = async ({ children }: LayoutProps<"/dashboard">) => {
  await requireUser();

  return (
    <div className="grid grid-cols-5 w-full min-h-dvh bg-background">
      <aside className="py-4 col-span-1 h-full">
        <div className="flex flex-col gap-10">
          <div className="px-2">
            <p className="text-headline-sm text-foreground">{BLOG_NAME}</p>
            <p className="mt-1 text-label text-muted-foreground">
              میز کار ویراستار
            </p>
          </div>
          <Suspense fallback={<div>در حال بارگذاری منو...</div>}>
            <NavListWithRole />
          </Suspense>
        </div>
        <div className="border-t border-border pt-4">
          <Suspense fallback={<div>در حال بارگذاری کاربر...</div>}>
            <UserCardWithUser />
          </Suspense>
        </div>
      </aside>
      <main className="col-span-4">
        <nav className="bg-surface-muted">
          <p className="text-muted-foreground bg-surface max-w-max">
            پیش نویس خودکار فعال است.
          </p>
        </nav>
        <section className="bg-background">{children}</section>
      </main>
    </div>
  );
};

export default Dashboard;
