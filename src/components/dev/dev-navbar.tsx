"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState, type ComponentType, type SVGProps } from "react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export type NavbarLink = {
  href: string;
  label: string;
  /** Optional. If omitted, the item renders label-only (no icon slot). */
  icon?: IconComponent;
};

export type DevNavbarProps = {
  links?: NavbarLink[];
  className?: string;
  showThemeToggle?: boolean;
};

/* -------------------------------------------------------------------------- */
/*  Default links                                                             */
/* -------------------------------------------------------------------------- */

const DEFAULT_LINKS: NavbarLink[] = [
  { href: "/", label: "خانه" },
  { href: "/posts", label: "نوشته‌ها" },
  { href: "/topics", label: "موضوعات" },
  { href: "/dashboard", label: "داشبورد" },
  { href: "/about", label: "درباره" },
];

/* -------------------------------------------------------------------------- */
/*  Theme toggle — 3 states: light → dark → system → light …                  */
/*  next-themes: attribute="class", defaultTheme="system"                     */
/* -------------------------------------------------------------------------- */

type ThemeMode = "light" | "dark" | "system";

const THEME_CYCLE: ThemeMode[] = ["light", "dark", "system"];

const THEME_META: Record<
  ThemeMode,
  { label: string; nextLabel: string }
> = {
  light: { label: "حالت روشن", nextLabel: "تغییر به حالت تاریک" },
  dark: { label: "حالت تاریک", nextLabel: "تغییر به حالت سیستم" },
  system: { label: "حالت سیستم", nextLabel: "تغییر به حالت روشن" },
};

function ThemeIcon({ mode }: { mode: ThemeMode }) {
  const common = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-5 w-5",
    "aria-hidden": true,
  };

  if (mode === "light") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    );
  }

  if (mode === "dark") {
    return (
      <svg {...common}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    );
  }

  // system
  return (
    <svg {...common}>
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Before mount, theme is unknown. Render a stable, disabled-looking placeholder.
  const current: ThemeMode = mounted
    ? ((theme as ThemeMode) ?? "system")
    : "system";

  const next: ThemeMode =
    THEME_CYCLE[(THEME_CYCLE.indexOf(current) + 1) % THEME_CYCLE.length];

  const cycle = () => {
    setTheme(next);
  };

  const meta = THEME_META[current];

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={mounted ? THEME_META[current].nextLabel : "تغییر تم"}
      title={mounted ? `${meta.label} — کلیک: ${THEME_META[current].nextLabel}` : "تغییر تم"}
      data-theme-mode={mounted ? current : undefined}
      className={[
        "relative grid h-11 w-11 shrink-0 place-items-center rounded-chip",
        "bg-chip text-chip-foreground",
        "border border-border",
        "motion-fast focus-ring",
        "hover:bg-surface-muted",
      ].join(" ")}
    >
      {mounted ? (
        <ThemeIcon mode={current} />
      ) : (
        <span className="h-5 w-5" aria-hidden="true" />
      )}

      {/* Small dot indicating current mode (optional visual hint). */}
      {mounted && (
        <span
          aria-hidden="true"
          className={[
            "absolute -top-0.5 -end-0.5 h-2 w-2 rounded-chip",
            current === "light" && "bg-warning",
            current === "dark" && "bg-primary",
            current === "system" && "bg-muted-foreground",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      )}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Nav item                                                                  */
/* -------------------------------------------------------------------------- */

function NavItem({
  link,
  active,
}: {
  link: NavbarLink;
  active: boolean;
}) {
  const Icon = link.icon;

  return (
    <Link
      href={link.href}
      aria-current={active ? "page" : undefined}
      className={[
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-1",
        "rounded-control px-1 py-1.5",
        "text-label leading-none",
        "motion-fast focus-ring",
        active
          ? "text-primary"
          : "text-navbar-foreground hover:text-foreground",
      ].join(" ")}
    >
      {Icon ? (
        <Icon className="h-5 w-5" aria-hidden="true" />
      ) : (
        // <span className="h-5 w-5" aria-hidden="true" />
        <span>#</span>
      )}
      <span className="max-w-full truncate">{link.label}</span>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*  Navbar (floating, centered, max-w-max)                                    */
/* -------------------------------------------------------------------------- */

export default function DevNavbar({
  links = DEFAULT_LINKS,
  className = "",
  showThemeToggle = true,
}: DevNavbarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav
      aria-label="ناوبری اصلی"
      className={[
        "fixed inset-x-0 bottom-0 z-50",
        "mx-auto w-max max-w-[calc(100vw-2rem)]",
        "mb-[calc(1rem+env(safe-area-inset-bottom))]",
        "rounded-chip",
        "border border-border",
        "bg-navbar text-navbar-foreground",
        "shadow-card-hover",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <ul
          role="list"
          className="flex min-w-0 items-stretch gap-1 overflow-x-auto"
        >
          {links.map((link) => (
            <li key={link.href} className="flex min-w-0 shrink-0">
              <NavItem link={link} active={isActive(link.href)} />
            </li>
          ))}
        </ul>

        {showThemeToggle && <ThemeToggleButton />}
      </div>
    </nav>
  );
}