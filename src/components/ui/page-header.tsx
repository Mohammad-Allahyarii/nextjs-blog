import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils/ui.utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export default function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-start md:justify-between",
        className,
      )}
    >
      <div className="flex flex-col gap-1 text-start">
        <h1 className="text-headline-lg text-foreground md:text-headline-xl">
          {title}
        </h1>
        {description ? (
          <p className="text-body-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </header>
  );
}
