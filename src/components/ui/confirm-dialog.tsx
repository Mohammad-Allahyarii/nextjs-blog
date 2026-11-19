"use client";

import { useId, type ComponentProps } from "react";
import { Button } from "@/src/components/common/Button";
import FormError from "@/src/components/common/form-error";
import Dialog from "@/src/components/ui/dialog";

export type ConfirmDialogVariant = "default" | "danger";

type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  // Used when the dialog only confirms a client-side decision.
  onConfirm?: () => void;
  // Used when the confirmation submits a Server Action instead.
  action?: ComponentProps<"form">["action"];
  userId?: string;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: ConfirmDialogVariant;
  pending?: boolean;
  error?: string;
  className?: string;
};

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  action,
  userId,
  title,
  description,
  confirmLabel,
  cancelLabel = "انصراف",
  variant = "default",
  pending = false,
  error,
  className,
}: ConfirmDialogProps) {
  const formId = useId();
  const submitsForm = action !== undefined;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      className={className}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={pending}>
            {cancelLabel}
          </Button>
          <Button
            type={submitsForm ? "submit" : "button"}
            form={submitsForm ? formId : undefined}
            variant={variant === "danger" ? "danger" : "primary"}
            onClick={submitsForm ? undefined : onConfirm}
            loading={pending}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      {submitsForm ? (
        <form id={formId} action={action}>
          {userId ? (
            <input type="hidden" name="userId" value={userId} />
          ) : null}
          {error ? <FormError>{error}</FormError> : null}
        </form>
      ) : null}
    </Dialog>
  );
}
