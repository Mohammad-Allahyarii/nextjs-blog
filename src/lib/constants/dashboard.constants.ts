import type { PermissionInput } from "@/src/lib/permissions";
import type { NavItem } from "@/src/lib/types/dashboardUi.types";


export type NavGroup = {
  label: string;
  /** Missing means every signed-in user may see the group. */
  permission?: PermissionInput;
  items: NavItem[];
}
/* Single source for the sidebar and the mobile drawer. Routes are placeholders. */
export const navGroups: NavGroup[] = [
  {
    label: 'نگارش و محتوا',
    items: [
      { label: 'پست‌های من', href: '/dashboard/posts', icon: 'article' },
      { label: 'نوشته‌ی جدید', href: '/dashboard/posts/new', icon: 'edit_square' },
      { label: 'نظرات', href: '/dashboard/comments', icon: 'chat_bubble' },
      { label: 'آمار و بازدید', href: '/dashboard/analytics', icon: 'insights' },
    ],
  },
  {
    label: 'مدیریت کلان',
    permission: { adminPanel: ['access'] },
    items: [
      { label: 'همه‌ی پست‌ها', href: '/dashboard/admin/posts', icon: 'library_books' },
      { label: 'مدیریت نظرات', href: '/dashboard/admin/comments', icon: 'rule' },
      { label: 'کیوریتوریال', href: '/dashboard/admin/curation', icon: 'auto_stories' },
      { label: 'لیست کاربران', href: '/dashboard/admin/users', icon: 'group', permission: { user: ['list'] } },
    ],
  },
]
