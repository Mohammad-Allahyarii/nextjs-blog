import Badge, { type BadgeVariant } from "@/src/components/ui/badge";
import type { Role } from "@/src/lib/permissions";
import { roleLabels } from "@/src/lib/types/user.types";

const roleVariants: Record<Role, BadgeVariant> = {
  user: "neutral",
  moderator: "info",
  editor: "warning",
  admin: "success",
};

type UserRoleBadgeProps = {
  role: Role;
  className?: string;
};

export default function UserRoleBadge({
  role,
  className,
}: UserRoleBadgeProps) {
  return (
    <Badge variant={roleVariants[role]} className={className}>
      {roleLabels[role]}
    </Badge>
  );
}
