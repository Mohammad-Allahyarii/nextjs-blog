import type { NavItem } from "@/src/lib/types/dashboardUi.types";
import NavLink from "./nav-link";

type BottomNavProps = {
  items: NavItem[];
};

export default function BottomNav({ items }: BottomNavProps) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="ناوبری پایین"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <div className="flex h-16 items-center justify-around gap-1 px-1">
        {items.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            variant="bottom"
          />
        ))}
      </div>
    </nav>
  );
}
