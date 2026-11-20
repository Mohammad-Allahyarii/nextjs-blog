import type { IconName } from "@/src/components/icons/icon";
import type { PermissionInput } from "@/src/lib/permissions";

export type NavItem = {
  label: string;
  href: string;
  icon: IconName;
  /** Missing means every signed-in user may see the item. */
  permission?: PermissionInput;
}
