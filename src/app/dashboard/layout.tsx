import { Suspense, cache } from "react";
import {
  navGroups,
  type NavGroup,
} from "@/src/lib/constants/dashboard.constants";
import { getCurrentUser, hasPermission, requireUser } from "@/src/lib/dal";
import type { PermissionInput } from "@/src/lib/permissions";
import type { NavItem } from "@/src/lib/types/dashboardUi.types";
import NavList from "@/src/components/dashboard/layout/nav-list";
import UserCard from "@/src/components/dashboard/layout/user-card";
import Sidebar from "@/src/components/dashboard/layout/sidebar";
import Topbar from "@/src/components/dashboard/layout/topbar";
import MobileShell from "@/src/components/dashboard/layout/mobile-shell";
import BottomNav from "@/src/components/dashboard/layout/bottom-nav";
import SidebarNavSkeleton from "@/src/components/dashboard/layout/sidebar-nav-skeleton";
import UserCardSkeleton from "@/src/components/dashboard/layout/user-card-skeleton";
import BottomNavSkeleton from "@/src/components/dashboard/layout/bottom-nav-skeleton";
import SkipLink from "@/src/components/dashboard/layout/skip-link";
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

// Cached so the sidebar, the drawer and the bottom nav share one permission pass.
const getVisibleNavGroups = cache(async (): Promise<NavGroup[]> => {
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
});

// Item order of the mobile bottom bar, mapped by meaning from the design.
const BOTTOM_NAV_HREFS = [
  "/dashboard/posts",
  "/dashboard/posts/new",
  "/dashboard/comments",
  "/dashboard/admin/curation",
];

function pickBottomNavItems(groups: NavGroup[]): NavItem[] {
  const items = groups.flatMap((group) => group.items);

  return BOTTOM_NAV_HREFS.flatMap((href) =>
    items.filter((item) => item.href === href),
  );
}

async function NavListWithPermissions() {
  return <NavList groups={await getVisibleNavGroups()} />;
}

async function DrawerNavWithPermissions() {
  return <NavList groups={await getVisibleNavGroups()} label="منوی موبایل" />;
}

async function BottomNavWithPermissions() {
  return <BottomNav items={pickBottomNavItems(await getVisibleNavGroups())} />;
}

async function UserCardWithUser() {
  const user = await getCurrentUser();
  if (!user) return null;

  return <UserCard user={user} />;
}

const Dashboard = async ({ children }: LayoutProps<"/dashboard">) => {
  const user = await requireUser();

  return (
    <ToastProvider>
      <SkipLink />
      <div className="min-h-dvh bg-background">
        <Sidebar
          nav={
            <Suspense fallback={<SidebarNavSkeleton />}>
              <NavListWithPermissions />
            </Suspense>
          }
          user={
            <Suspense fallback={<UserCardSkeleton />}>
              <UserCardWithUser />
            </Suspense>
          }
        />

        <div className="flex min-h-dvh min-w-0 flex-col lg:ps-sidebar">
          <MobileShell
            userName={user.name}
            userImage={user.image ?? null}
            nav={
              <Suspense fallback={<SidebarNavSkeleton />}>
                <DrawerNavWithPermissions />
              </Suspense>
            }
            userCard={
              <Suspense fallback={<UserCardSkeleton />}>
                <UserCardWithUser />
              </Suspense>
            }
          />

          <Topbar userName={user.name} userImage={user.image ?? null} />

          {/* Pages already own their own `px-gutter py-section-dashboard`, so the
              shell only reserves the space the bottom bar needs. */}
          <main
            id="main-content"
            className="flex min-w-0 flex-1 flex-col pb-[calc(env(safe-area-inset-bottom)+6rem)] lg:pb-0"
          >
            <div className="mx-auto flex w-full min-w-0 max-w-canvas flex-1 flex-col">
              {children}
            </div>
          </main>
        </div>

        <Suspense fallback={<BottomNavSkeleton />}>
          <BottomNavWithPermissions />
        </Suspense>
      </div>
    </ToastProvider>
  );
};

export default Dashboard;
