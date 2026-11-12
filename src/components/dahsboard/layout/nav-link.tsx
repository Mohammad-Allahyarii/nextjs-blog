"use client";

import { NavItem } from "@/src/lib/types/dashboardUi.types";
import { cn } from "@/src/lib/utils/ui.utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = Pick<NavItem, "href" | "icon" | "label"> & {
  variant?: "sidebar" | "bottom";
};

const base = {
  sidebar:
    "focus-ring flex h-11 items-center gap-2 rounded-control px-4 text-body-md font-medium transition-colors duration-150 ease-out",
  bottom:
    "focus-ring flex h-12 w-16 flex-col items-center justify-center rounded-control text-label transition-colors duration-150 ease-out",
};

const states = {
  sidebar: {
    active: "bg-primary-soft text-primary-soft-foreground",
    idle: "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
  },
  bottom: {
    active: "text-primary",
    idle: "text-muted-foreground hover:text-foreground",
  },
};

export default function NavLink({
  href,
  icon,
  label,
  variant = "sidebar",
}: NavLinkProps) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        base[variant],
        active ? states[variant].active : states[variant].idle,
      )}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
