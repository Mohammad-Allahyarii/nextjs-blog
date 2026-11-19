import { Suspense } from "react";
import { BLOG_NAME } from "@/src/lib/constants/initial.constants";
import {
  navGroups,
  type NavGroup,
} from "@/src/lib/constants/dashboard.constants";
import { getCurrentUser, hasPermission, requireUser } from "@/src/lib/dal";
import type { PermissionInput } from "@/src/lib/permissions";
import NavList from "@/src/components/dashboard/layout/nav-list";
import UserCard from "@/src/components/dashboard/layout/user-card";
import { ToastProvider } from "@/src/components/ui/toast";

// The session read below cannot be part of a static shell, so this segment
// keeps blocking on the server instead of opting into instant navigation.
export const instant = false;

// Identical permissions share one check, and key order never changes the key.
function permissionKey(permission: PermissionInput): string {
  return Object.entries(permission)
    .map(
      ([resource, actions]) =>
        `${resource}:${[...(actions ?? [])].sort().join(",")}`,
    )
    .sort()
    .join("|");
}

async function getVisibleNavGroups(): Promise<NavGroup[]> {
  const requirements = new Map<string, PermissionInput>();

  for (const group of navGroups) {
    if (group.permission) {
      requirements.set(permissionKey(group.permission), group.permission);
    }
    for (const item of group.items) {
      if (item.permission) {
        requirements.set(permissionKey(item.permission), item.permission);
      }
    }
  }

  const entries = [...requirements.entries()];
  const results = await Promise.all(
    entries.map(([, permission]) => hasPermission(permission)),
  );
  const allowed = new Set(
    entries.filter((_, index) => results[index]).map(([key]) => key),
  );

  const canSee = (permission?: PermissionInput) =>
    !permission || allowed.has(permissionKey(permission));

  return navGroups
    .filter((group) => canSee(group.permission))
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canSee(item.permission)),
    }))
    .filter((group) => group.items.length > 0);
}

async function NavListWithPermissions() {
  return <NavList groups={await getVisibleNavGroups()} />;
}

async function UserCardWithUser() {
  const user = await getCurrentUser();
  if (!user) return null;

  return <UserCard user={user} />;
}

const Dashboard = async ({ children }: LayoutProps<"/dashboard">) => {
  await requireUser();

  return (
    <ToastProvider>
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
              <NavListWithPermissions />
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
    </ToastProvider>
  );
};

export default Dashboard;
