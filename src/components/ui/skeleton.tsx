import type { ComponentProps } from "react";
import { cn } from "@/src/lib/utils/ui.utils";

export default function Skeleton({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-control bg-surface-muted", className)}
      {...props}
    />
  );
}
