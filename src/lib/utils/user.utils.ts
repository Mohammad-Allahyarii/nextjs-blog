import { getRole } from "@/src/lib/dal"


export const adminOrUserRole = async () => {
  const userRole = await getRole()
  if (userRole === "admin") {
    return "admin"
  } 

  return "user"
}