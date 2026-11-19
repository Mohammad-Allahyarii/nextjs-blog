import { Button } from "@/src/components/common/Button";
import SearchBox from "@/src/components/ui/search-box";
import Select, { type SelectOption } from "@/src/components/ui/select";
import { ROLES } from "@/src/lib/permissions";
import { roleLabels } from "@/src/lib/types/user.types";
import { cn } from "@/src/lib/utils/ui.utils";

const roleOptions: SelectOption[] = ROLES.map((role) => ({
  value: role,
  label: roleLabels[role],
}));

const statusOptions: SelectOption[] = [
  { value: "", label: "همه" },
  { value: "active", label: "فعال" },
  { value: "banned", label: "بن‌شده" },
];

type UsersToolbarProps = {
  defaultValues: { q?: string; role?: string; status?: string };
  className?: string;
};

export default function UsersToolbar({
  defaultValues,
  className,
}: UsersToolbarProps) {
  return (
    <form
      method="get"
      className={cn("flex flex-col gap-3 md:flex-row md:items-end", className)}
    >
      <div className="w-full md:max-w-sm">
        <SearchBox
          name="q"
          label="جستجوی کاربر"
          hideLabel
          placeholder="جستجو با نام یا ایمیل..."
          defaultValue={defaultValues.q ?? ""}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 md:flex md:items-end">
        <Select
          name="role"
          label="نقش"
          hideLabel
          defaultValue={defaultValues.role ?? ""}
          options={[{ value: "", label: "همه نقش‌ها" }, ...roleOptions]}
          className="md:w-44"
        />
        <Select
          name="status"
          label="وضعیت"
          hideLabel
          defaultValue={defaultValues.status ?? ""}
          options={statusOptions}
          className="md:w-36"
        />
        <Button type="submit" variant="secondary" className="col-span-2 md:col-auto">
          اعمال فیلتر
        </Button>
      </div>
    </form>
  );
}
