"use client";

import {
  useEffect,
  useId,
  useRef,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import { Button } from "@/src/components/common/Button";
import CloseIcon from "@/src/components/icons/close-icon";
import { cn } from "@/src/lib/utils/ui.utils";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children?: ReactNode;
  className?: string;
};

export default function Drawer({
  open,
  onClose,
  title,
  children,
  className,
}: DrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) {
        previousFocusRef.current =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        dialog.showModal();
      }
      return;
    }

    if (dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function handleClose() {
    previousFocusRef.current?.focus();
    onClose();
  }

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    dialogRef.current?.close();
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) dialogRef.current.close();
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      aria-labelledby={titleId}
      className={cn(
        "fixed inset-y-0 start-0 end-auto m-0 h-dvh w-[300px] min-h-full max-w-[85vw] border-0 border-e border-border bg-surface p-0 text-foreground shadow-card-hover",
        "translate-x-full motion-base open:translate-x-0",
        "backdrop:bg-foreground/20 backdrop:backdrop-blur-sm",
        className,
      )}
    >
      <h2 id={titleId} className="sr-only">
        {title}
      </h2>

      <Button
        variant="ghost"
        size="icon"
        aria-label="بستن منو"
        onClick={() => dialogRef.current?.close()}
        className="absolute end-2 top-2"
      >
        <CloseIcon className="size-5" />
      </Button>

      {children}
    </dialog>
  );
}