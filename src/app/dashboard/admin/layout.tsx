import { requirePermission } from "@/src/lib/dal";

export const instant = false;

const layout = async ({ children }: LayoutProps<"/dashboard/admin">) => {
  await requirePermission({ adminPanel: ["access"] });

  return <>{children}</>;
};

export default layout;
