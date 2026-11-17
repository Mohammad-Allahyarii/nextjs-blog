import { hasPermission } from "@/src/lib/dal"

// The sidebar only needs to know whether the admin groups are visible, so ask
// the same permission that gates /dashboard/admin instead of comparing role
// strings: moderators and editors have access too.
export const adminOrUserRole = async (): Promise<"admin" | "user"> => {
  const canAccessAdminPanel = await hasPermission({ adminPanel: ["access"] })
  return canAccessAdminPanel ? "admin" : "user"
}
