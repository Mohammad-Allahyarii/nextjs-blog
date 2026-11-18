import type { PermissionInput } from "@/src/lib/permissions";

export type NavItem = {
  label: string;
  href: string;
  icon: string;
  /** Missing means every signed-in user may see the item. */
  permission?: PermissionInput;
}
