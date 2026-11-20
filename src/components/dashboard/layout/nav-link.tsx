"use client";

import Icon from "@/src/components/icons/icon";
import type { NavItem } from "@/src/lib/types/dashboardUi.types";
import { cn } from "@/src/lib/utils/ui.utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = Pick<NavItem, "href" | "icon" | "label"> & {
  variant?: "sidebar" | "bottom";
};

const base = {
  sidebar:
    "focus-ring flex h-11 items-center gap-3 rounded-control px-3 text-body-sm font-medium motion-fast",
  bottom:
    "focus-ring flex h-12 w-16 flex-col items-center justify-center gap-1 rounded-control text-label motion-fast",
};

const states = {
  sidebar: {
    active: "bg-primary text-on-primary shadow-card",
    idle: "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
  },
  bottom: {
    active: "font-bold text-primary",
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
      <Icon name={icon} className="size-5 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}
