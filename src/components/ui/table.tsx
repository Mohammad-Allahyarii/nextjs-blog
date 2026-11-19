import type { ComponentProps } from "react";
import { cn } from "@/src/lib/utils/ui.utils";

type TableProps = ComponentProps<"table"> & {
  caption: string;
};

export function Table({ caption, className, children, ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn("w-full border-collapse text-start", className)}
        {...props}
      >
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: ComponentProps<"thead">) {
  return (
    <thead
      className={cn(
        "border-b border-border bg-surface-muted/60 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return <tbody className={cn("divide-y divide-border", className)} {...props} />;
}

export function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      className={cn("motion-fast hover:bg-surface-muted/60", className)}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      scope="col"
      className={cn(
        "px-4 py-3 text-start align-middle text-label font-medium",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      className={cn("px-4 py-3.5 align-middle text-start", className)}
      {...props}
    />
  );
}
