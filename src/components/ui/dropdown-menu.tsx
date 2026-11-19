"use client";

import Link from "next/link";
import {
  useId,
  useRef,
  type ComponentProps,
  type ReactNode,
  type ToggleEvent,
} from "react";
import MoreIcon from "@/src/components/icons/more-icon";
import { cn } from "@/src/lib/utils/ui.utils";

type DropdownMenuProps = {
  label: string;
  trigger?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function DropdownMenu({
  label,
  trigger,
  children,
  className,
}: DropdownMenuProps) {
  const popoverId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // The popover lives in the top layer, so its position is measured from the
  // trigger once it opens instead of being placed by the page flow.
  function handleToggle(event: ToggleEvent<HTMLDivElement>) {
    if (event.newState !== "open") return;

    const triggerElement = triggerRef.current;
    const menuElement = menuRef.current;
    if (!triggerElement || !menuElement) return;

    const triggerRect = triggerElement.getBoundingClientRect();
    const menuRect = menuElement.getBoundingClientRect();
    const isRtl = getComputedStyle(triggerElement).direction === "rtl";
    const startFromEdge = isRtl
      ? window.innerWidth - triggerRect.right
      : triggerRect.left;
    const maxStart = Math.max(8, window.innerWidth - menuRect.width - 8);

    menuElement.style.insetBlockStart = `${Math.min(
      triggerRect.bottom + 6,
      window.innerHeight - menuRect.height - 8,
    )}px`;
    menuElement.style.insetBlockEnd = "auto";
    menuElement.style.insetInlineStart = `${Math.min(
      Math.max(8, startFromEdge),
      maxStart,
    )}px`;
    menuElement.style.insetInlineEnd = "auto";
  }

  return (
    <div className={cn("inline-flex", className)}>
      <button
        ref={triggerRef}
        type="button"
        popoverTarget={popoverId}
        aria-label={label}
        className="focus-ring motion-fast grid size-9 place-items-center rounded-control text-muted-foreground hover:bg-surface-muted hover:text-foreground"
      >
        {trigger ?? <MoreIcon className="size-5" />}
      </button>

      <div
        ref={menuRef}
        id={popoverId}
        popover="auto"
        onToggle={handleToggle}
        className="inset-auto m-0 min-w-48 rounded-control border border-border bg-surface p-1 text-foreground shadow-card-hover"
      >
        <div className="flex flex-col">{children}</div>
      </div>
    </div>
  );
}

export type DropdownMenuItemVariant = "default" | "danger";

type DropdownMenuItemBase = {
  children: ReactNode;
  variant?: DropdownMenuItemVariant;
  disabled?: boolean;
  className?: string;
};

type DropdownMenuItemProps = DropdownMenuItemBase &
  (
    | { href: string; onClick?: never }
    | { href?: undefined; onClick?: ComponentProps<"button">["onClick"] }
  );

const itemStyles =
  "flex w-full items-center gap-2 rounded-control px-3 py-2 text-start text-body-sm motion-fast focus-ring disabled:pointer-events-none disabled:opacity-50";

function closeMenu(element: HTMLElement) {
  const popover = element.closest("[popover]");
  if (popover instanceof HTMLElement) popover.hidePopover();
}

export function DropdownMenuItem(props: DropdownMenuItemProps) {
  const { children, variant = "default", disabled = false, className } = props;
  const classes = cn(
    itemStyles,
    variant === "danger"
      ? "text-danger hover:bg-danger-soft"
      : "text-foreground hover:bg-surface-muted",
    className,
  );

  if (props.href !== undefined) {
    if (disabled) {
      return (
        <span aria-disabled="true" className={cn(classes, "opacity-50")}>
          {children}
        </span>
      );
    }

    return (
      <Link
        href={props.href}
        onClick={(event) => closeMenu(event.currentTarget)}
        className={classes}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(event) => {
        props.onClick?.(event);
        closeMenu(event.currentTarget);
      }}
      className={classes}
    >
      {children}
    </button>
  );
}
