import { cn } from "@/src/lib/utils/ui.utils";
import type { ComponentProps } from "react";

type IconButtonProps = Omit<
  ComponentProps<"button">,
  "children" | "aria-label"
> & {
  icon: string;
  label: string;
  size?: "md" | "lg";
};

const sizes = { md: "size-9", lg: "size-11" };

export default function IconButton({
  icon,
  label,
  size = "md",
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        "focus-ring grid place-items-center rounded-control text-muted-foreground transition-colors duration-150 ease-out hover:bg-surface-muted hover:text-foreground",
        sizes[size],
        className,
      )}
      {...props}
    >
      <span>{icon}</span>
    </button>
  );
}
