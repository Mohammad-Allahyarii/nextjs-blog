"use client";

import {
  useEffect,
  useId,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { Button } from "@/src/components/common/Button";
import CloseIcon from "@/src/components/icons/close-icon";
import { cn } from "@/src/lib/utils/ui.utils";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export default function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

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

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) dialogRef.current.close();
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onClick={handleBackdropClick}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className={cn(
        "m-auto w-[calc(100%-2rem)] max-w-lg rounded-card border border-border bg-surface p-0 text-foreground shadow-card-hover open:block",
        "backdrop:bg-foreground/40",
        className,
      )}
    >
      <div className="flex flex-col gap-4 p-card">
        <header className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 text-start">
            <h2 id={titleId} className="text-headline-sm text-foreground">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="text-body-sm text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="بستن"
            onClick={onClose}
          >
            <CloseIcon className="size-4" />
          </Button>
        </header>

        {children}

        {footer ? (
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {footer}
          </div>
        ) : null}
      </div>
    </dialog>
  );
}
