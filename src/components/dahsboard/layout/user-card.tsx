import IconButton from '@/src/components/dahsboard/layout/icon-button'
import { Role } from '@/src/lib/dal';
import { roleLabels } from '@/src/lib/types/user.types'

export type ShellUser = { name: string; role: Role }

export default function UserCard({ user }: { user: ShellUser }) {
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
      <IconButton icon="logout" label="خروج" className="hover:text-danger" />
    </div>
  )
}
