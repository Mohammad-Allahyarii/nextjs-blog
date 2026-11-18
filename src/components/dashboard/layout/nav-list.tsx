import type { NavGroup } from "@/src/lib/constants/dashboard.constants";
import NavLink from "./nav-link";
import { cn } from "@/src/lib/utils/ui.utils";

export default function NavList({ groups }: { groups: NavGroup[] }) {
  return (
    <nav aria-label="منوی داشبورد" className="flex flex-col">
      {groups.map((group, index) => (
        <div
          key={group.label}
          className={cn("flex flex-col gap-1", index > 0 && "mt-4")}
        >
          <p className="px-2 pb-1 text-label text-subtle-foreground">
            {group.label}
          </p>
          {group.items.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </div>
      ))}
    </nav>
  );
}
