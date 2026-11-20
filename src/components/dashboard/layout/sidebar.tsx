import { BLOG_NAME } from "@/src/lib/constants/initial.constants";
import type { ReactNode } from "react";

type SidebarProps = {
  nav: ReactNode;
  user: ReactNode;
};

export default function Sidebar({ nav, user }: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 start-0 z-30 hidden w-sidebar flex-col justify-between border-e border-border bg-surface py-gutter lg:flex">
      <div className="flex min-h-0 flex-col gap-8 px-4">
        <div className="flex flex-col gap-1">
          <p className="text-headline-sm text-foreground">{BLOG_NAME}</p>
          <p className="text-label text-muted-foreground">میز کار ویراستار</p>
        </div>
        <div className="min-h-0 overflow-y-auto">{nav}</div>
      </div>
      <div className="border-t border-border px-4 pt-3">{user}</div>
    </aside>
  );
}
