import Icon, { type IconName } from "@/src/components/icons/icon";
import { cn } from "@/src/lib/utils/ui.utils";
import type { ComponentProps } from "react";

type IconButtonProps = Omit<
  ComponentProps<"button">,
  "children" | "aria-label"
> & {
  icon: IconName;
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
        "focus-ring motion-fast grid place-items-center rounded-control text-muted-foreground hover:bg-surface-muted hover:text-foreground",
        sizes[size],
        className,
      )}
      {...props}
    >
      <Icon name={icon} className="size-5" />
    </button>
  );
}
