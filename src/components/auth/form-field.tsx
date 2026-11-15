import type { ComponentProps } from "react";
import { cn } from "@/src/lib/utils/ui.utils";
import FormError from "@/src/components/auth/form-error";

type FormFieldProps = Omit<ComponentProps<"input">, "id" | "className"> & {
  id: string;
  label: string;
  error?: string;
  inputClassName?: string;
};

export default function FormField({
  id,
  label,
  error,
  inputClassName,
  ...inputProps
}: FormFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5 text-start">
      <label htmlFor={id} className="text-body-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "h-11 w-full rounded-control border bg-surface px-3.5 text-body-md text-foreground transition-shadow motion-fast placeholder:text-subtle-foreground",
          error ? "focus-ring-error" : "border-border focus-ring",
          inputClassName,
        )}
        {...inputProps}
      />
      {error ? <FormError id={errorId}>{error}</FormError> : null}
    </div>
  );
}
