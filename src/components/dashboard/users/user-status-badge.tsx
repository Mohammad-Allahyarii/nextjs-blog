import Badge from "@/src/components/ui/badge";

type UserStatusBadgeProps = {
  banned: boolean;
  banExpires: string | null;
  className?: string;
};

export default function UserStatusBadge({
  banned,
  banExpires,
  className,
}: UserStatusBadgeProps) {
  if (!banned) {
    return (
      <Badge variant="success" dot className={className}>
        فعال
      </Badge>
    );
  }

  if (banExpires) {
    return (
      <Badge variant="warning" dot className={className}>
        بن موقت
      </Badge>
    );
  }

  return (
    <Badge variant="danger" dot className={className}>
      بن‌شده
    </Badge>
  );
}
