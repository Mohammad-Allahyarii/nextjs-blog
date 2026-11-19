import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils/ui.utils";

type CardProps = {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function Card({
  title,
  description,
  actions,
  children,
  className,
}: CardProps) {
  const hasHeader = Boolean(title || description || actions);

  return (
    <section
      className={cn(
        "rounded-card border border-border bg-surface p-card shadow-card",
        className,
      )}
    >
      {hasHeader ? (
        <header className="mb-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-1 text-start">
            {title ? (
              <h2 className="text-headline-sm text-foreground">{title}</h2>
            ) : null}
            {description ? (
              <p className="text-body-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
