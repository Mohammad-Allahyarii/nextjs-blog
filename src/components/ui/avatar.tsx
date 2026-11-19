import { cn } from "@/src/lib/utils/ui.utils";

export type AvatarSize = "sm" | "md" | "lg";

const sizeStyles: Record<AvatarSize, string> = {
  sm: "size-8 text-label",
  md: "size-10 text-body-sm",
  lg: "size-14 text-headline-sm",
};

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("");
}

type AvatarProps = {
  name: string;
  src?: string | null;
  size?: AvatarSize;
  className?: string;
};

export default function Avatar({
  name,
  src,
  size = "md",
  className,
}: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-grid shrink-0 place-items-center overflow-hidden rounded-chip bg-avatar text-avatar-foreground",
        sizeStyles[size],
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
        />
      ) : (
        <span aria-hidden="true">{getInitials(name)}</span>
      )}
    </span>
  );
}
