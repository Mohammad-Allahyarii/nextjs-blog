"use client";
import Avatar from "@/src/components/ui/avatar";
import IconButton from "@/src/components/dashboard/layout/icon-button";
import { authClient } from "@/src/lib/auth-client";
import type { Role } from "@/src/lib/permissions";
import { roleLabels } from "@/src/lib/types/user.types"
import { useRouter } from "next/navigation";

export type ShellUser = { name: string; image?: string | null; role: Role }

export default function UserCard({ user }: { user: ShellUser }) {

  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth");
          router.refresh();
        },
      },
    });
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-card p-2">
      <div className="flex min-w-0 items-center gap-2">
        <Avatar name={user.name} src={user.image} size="sm" />
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-body-sm font-medium text-foreground">{user.name}</span>
          <span className="truncate text-label text-muted-foreground">{roleLabels[user.role]}</span>
        </div>
      </div>
      <IconButton onClick={handleLogout} icon="logout" label="خروج" className="hover:text-danger" />
    </div>
  )
}
