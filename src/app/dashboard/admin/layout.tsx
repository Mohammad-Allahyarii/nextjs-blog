import { requireAdmin } from "@/src/lib/dal";

export const instant = false;

const layout = async ({ children }: LayoutProps<"/dashboard/admin">) => {
  await requireAdmin();

  return <>{children}</>;
};

export default layout;
