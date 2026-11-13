"use client";
import IconButton from '@/src/components/dashboard/layout/icon-button';
import { authClient } from '@/src/lib/auth-client';
import { Role } from '@/src/lib/dal';
import { roleLabels } from '@/src/lib/types/user.types'
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export type ShellUser = { name: string; role: Role }

export default function UserCard({ user }: { user: ShellUser }) {

  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth");
          router.refresh();
        },
        onError: () => setPending(false),
      },
    });
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-card p-2">
      <div className="flex min-w-0 items-center gap-2">
        <span>AV</span>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-body-sm font-medium text-foreground">{user.name}</span>
          <span className="truncate text-label text-muted-foreground">{roleLabels[user.role]}</span>
        </div>
      </div>
      {/* Wire to a sign-out Server Action later */}
      <IconButton onClick={handleLogout} icon="logout" label="خروج" className="hover:text-danger" />
    </div>
  )
}
