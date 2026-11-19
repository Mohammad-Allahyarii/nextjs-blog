import { useId, type ComponentProps } from "react";
import FormError from "@/src/components/common/form-error";
import { cn } from "@/src/lib/utils/ui.utils";

type NativeTextareaProps = Omit<ComponentProps<"textarea">, "className">;

export type TextareaProps = NativeTextareaProps & {
  label?: string;
  hideLabel?: boolean;
  hint?: string;
  error?: string;
  className?: string;
};

export default function Textarea({
  label,
  hideLabel = false,
  hint,
  error,
  className,
  id,
  required,
  rows = 4,
  ...textareaProps
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const hintId = `${textareaId}-hint`;
  const errorId = `${textareaId}-error`;

  return (
    <div className={cn("flex w-full flex-col gap-1.5 text-start", className)}>
      {label ? (
        <label
          htmlFor={textareaId}
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

      <textarea
        id={textareaId}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={cn(
          "w-full resize-y rounded-control border bg-surface px-3.5 py-2.5 text-body-md text-foreground motion-fast placeholder:text-subtle-foreground",
          "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-subtle-foreground disabled:opacity-60",
          error
            ? "border-danger focus-ring-error"
            : "border-border hover:not-focus-visible:border-border-strong focus-ring-soft",
        )}
        {...textareaProps}
      />

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
