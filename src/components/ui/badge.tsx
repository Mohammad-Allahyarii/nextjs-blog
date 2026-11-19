import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils/ui.utils";

export type BadgeVariant =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info";

const containerStyles: Record<BadgeVariant, string> = {
  neutral: "bg-surface-muted text-muted-foreground",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-primary-soft text-primary-soft-foreground",
};

const dotStyles: Record<BadgeVariant, string> = {
  neutral: "bg-muted-foreground",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-primary",
};

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
};

export default function Badge({
  children,
  variant = "neutral",
  dot = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-chip px-2.5 py-0.5 text-label",
        containerStyles[variant],
        className,
      )}
    >
      {dot ? (
        <span
          aria-hidden="true"
          className={cn("size-1.5 shrink-0 rounded-chip", dotStyles[variant])}
        />
      ) : null}
      {children}
    </span>
  );
}
