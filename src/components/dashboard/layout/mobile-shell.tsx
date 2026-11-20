"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import Drawer from "@/src/components/ui/drawer";
import Avatar from "@/src/components/ui/avatar";
import MenuIcon from "@/src/components/icons/menu-icon";
import { BLOG_NAME } from "@/src/lib/constants/initial.constants";

type MobileShellProps = {
  userName: string;
  userImage: string | null;
  nav: ReactNode;
  userCard: ReactNode;
};

export default function MobileShell({
  userName,
  userImage,
  nav,
  userCard,
}: MobileShellProps) {
  const [open, setOpen] = useState(false);

  function handleLinkClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target instanceof Element && event.target.closest("a")) {
      setOpen(false);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex min-h-14 items-center justify-between gap-2 border-b border-border bg-surface/90 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-xl lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="منو"
          aria-haspopup="dialog"
          aria-expanded={open}
          className="focus-ring motion-fast grid size-11 place-items-center rounded-control text-foreground hover:bg-surface-muted"
        >
          <MenuIcon className="size-6" />
        </button>
        <p className="truncate text-headline-sm font-bold text-foreground">
          {BLOG_NAME}
        </p>
        <Avatar name={userName} src={userImage} size="sm" />
      </header>

      <Drawer open={open} onClose={() => setOpen(false)} title="منوی داشبورد">
        <div
          onClick={handleLinkClick}
          className="flex h-full flex-col justify-between gap-4 px-4 pb-4 pt-14"
        >
          <div className="min-h-0 overflow-y-auto">{nav}</div>
          <div className="border-t border-border pt-3">{userCard}</div>
        </div>
      </Drawer>
    </>
  );
}
