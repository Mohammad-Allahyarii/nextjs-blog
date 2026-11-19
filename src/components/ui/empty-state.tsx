import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils/ui.utils";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-card border border-dashed border-border bg-surface px-5 py-12 text-center",
        className,
      )}
    >
      {icon ? (
        <span className="mb-1 grid size-12 place-items-center rounded-chip bg-surface-muted text-muted-foreground">
          {icon}
        </span>
      ) : null}
      <p className="text-headline-sm text-foreground">{title}</p>
      {description ? (
        <p className="max-w-prose text-body-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
