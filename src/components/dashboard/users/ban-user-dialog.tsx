"use client";

import { useId, type ComponentProps } from "react";
import { Button } from "@/src/components/common/Button";
import FormError from "@/src/components/common/form-error";
import Dialog from "@/src/components/ui/dialog";
import Select from "@/src/components/ui/select";
import Textarea from "@/src/components/ui/textarea";
import { BAN_DURATION_OPTIONS } from "@/src/lib/constants/user-management.constants";
import type {
  UserActionFieldName,
  UserListItem,
} from "@/src/lib/types/user-management.types";

type BanUserDialogProps = {
  open: boolean;
  onClose: () => void;
  user: UserListItem;
  action?: ComponentProps<"form">["action"];
  pending?: boolean;
  error?: string;
  fieldErrors?: Partial<Record<UserActionFieldName, string[]>>;
  className?: string;
};

export default function BanUserDialog({
  open,
  onClose,
  user,
  action,
  pending = false,
  error,
  fieldErrors,
  className,
}: BanUserDialogProps) {
  const formId = useId();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`بن کردن ${user.name}`}
      description="با بن کردن کاربر، دسترسی او به داشبورد و نوشتن مطلب قطع می‌شود."
      className={className}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={pending}>
            انصراف
          </Button>
          <Button
            type="submit"
            form={formId}
            variant="danger"
            loading={pending}
          >
            بن کردن
          </Button>
        </>
      }
    >
      <form id={formId} action={action} className="flex flex-col gap-4">
        <input type="hidden" name="userId" value={user.id} />
        <Textarea
          name="reason"
          label="دلیل بن (اختیاری)"
          placeholder="دلیل این تصمیم برای ثبت در سابقه..."
          rows={3}
          error={fieldErrors?.reason?.[0]}
        />
        <Select
          name="duration"
          label="مدت بن"
          defaultValue="permanent"
          options={BAN_DURATION_OPTIONS}
          hint="بن دائم تا زمان رفع دستی ادامه دارد."
          error={fieldErrors?.duration?.[0]}
        />
        {error ? <FormError>{error}</FormError> : null}
      </form>
    </Dialog>
  );
}
