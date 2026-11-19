"use client";

import { useId, type ComponentProps } from "react";
import { Button } from "@/src/components/common/Button";
import FormError from "@/src/components/common/form-error";
import Dialog from "@/src/components/ui/dialog";
import Select, { type SelectOption } from "@/src/components/ui/select";
import { ROLES } from "@/src/lib/permissions";
import { roleLabels } from "@/src/lib/types/user.types";
import type {
  UserActionFieldName,
  UserListItem,
} from "@/src/lib/types/user-management.types";

const roleOptions: SelectOption[] = ROLES.map((role) => ({
  value: role,
  label: roleLabels[role],
}));

type ChangeRoleDialogProps = {
  open: boolean;
  onClose: () => void;
  user: UserListItem;
  action?: ComponentProps<"form">["action"];
  pending?: boolean;
  error?: string;
  fieldErrors?: Partial<Record<UserActionFieldName, string[]>>;
  className?: string;
};

export default function ChangeRoleDialog({
  open,
  onClose,
  user,
  action,
  pending = false,
  error,
  fieldErrors,
  className,
}: ChangeRoleDialogProps) {
  const formId = useId();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="تغییر نقش کاربر"
      description={`نقش تازه‌ی ${user.name} بلافاصله روی دسترسی‌های او اثر می‌گذارد.`}
      className={className}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={pending}>
            انصراف
          </Button>
          <Button type="submit" form={formId} loading={pending}>
            ذخیره نقش
          </Button>
        </>
      }
    >
      <form id={formId} action={action} className="flex flex-col gap-4">
        <input type="hidden" name="userId" value={user.id} />
        <Select
          name="role"
          label="نقش"
          defaultValue={user.role}
          options={roleOptions}
          error={fieldErrors?.role?.[0]}
        />
        {error ? <FormError>{error}</FormError> : null}
      </form>
    </Dialog>
  );
}
