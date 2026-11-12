import { navGroups } from "@/src/lib/constants/dashboard.constants";
import { Role } from "@/src/lib/dal";
import NavLink from "./nav-link";
import { cn } from "@/src/lib/utils/ui.utils";

export default function NavList({ role }: { role: Role }) {
  const groups = navGroups.filter(
    (group) => !group.adminOnly || role.toLocaleLowerCase() === "admin",
  );

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
