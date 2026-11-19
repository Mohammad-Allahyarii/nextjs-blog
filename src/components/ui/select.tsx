import { useId, type ComponentProps } from "react";
import FormError from "@/src/components/common/form-error";
import type { InputSize } from "@/src/components/common/input";
import ChevronIcon from "@/src/components/icons/chevron-icon";
import { cn } from "@/src/lib/utils/ui.utils";

export type SelectOption = { value: string; label: string };

type NativeSelectProps = Omit<ComponentProps<"select">, "size" | "className">;

export type SelectProps = NativeSelectProps & {
  options: SelectOption[];
  label?: string;
  hideLabel?: boolean;
  hint?: string;
  error?: string;
  size?: InputSize;
  className?: string;
};

const sizeStyles: Record<InputSize, string> = {
  sm: "h-9 ps-3 pe-9 text-body-md md:text-body-sm",
  md: "h-11 ps-3.5 pe-10 text-body-md",
  lg: "h-12 ps-3.5 pe-10 text-body-md",
};

const iconSizeStyles: Record<InputSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-5",
};

export default function Select({
  options,
  label,
  hideLabel = false,
  hint,
  error,
  size = "md",
  className,
  id,
  required,
  ...selectProps
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const hintId = `${selectId}-hint`;
  const errorId = `${selectId}-error`;

  return (
    <div className={cn("flex w-full flex-col gap-1.5 text-start", className)}>
      {label ? (
        <label
          htmlFor={selectId}
          className={cn(
            "text-body-sm font-medium text-foreground",
            hideLabel && "sr-only",
          )}
        >
          {label}
          {required ? (
            <span aria-hidden="true" className="ms-1 text-danger">
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <div className="relative w-full">
        <select
          id={selectId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            "w-full appearance-none rounded-control border bg-surface text-foreground motion-fast",
            "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-subtle-foreground disabled:opacity-60",
            sizeStyles[size],
            error
              ? "border-danger focus-ring-error"
              : "border-border hover:not-focus-visible:border-border-strong focus-ring-soft",
          )}
          {...selectProps}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronIcon
          direction="down"
          className={cn(
            "pointer-events-none absolute inset-y-0 end-3 my-auto text-muted-foreground",
            iconSizeStyles[size],
          )}
        />
      </div>

      {error ? (
        <FormError id={errorId}>{error}</FormError>
      ) : hint ? (
        <p id={hintId} className="text-body-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
