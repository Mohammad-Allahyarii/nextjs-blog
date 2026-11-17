import { requirePermission } from "@/src/lib/dal";

const Users = async () => {
  // Layouts are not re-run on client navigation, so the page checks its own
  // permission as well.
  await requirePermission({ user: ["list"] });

  return <div>Users</div>;
};

export default Users;
