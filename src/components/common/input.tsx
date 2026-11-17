import { useId } from "react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/src/lib/utils/ui.utils";
import FormError from "@/src/components/common/form-error";

export type InputVariant = "outline" | "filled";
export type InputSize = "sm" | "md" | "lg";

type NativeInputProps = Omit<ComponentProps<"input">, "size" | "className">;

export type InputProps = NativeInputProps & {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  hideLabel?: boolean;
  hint?: string;
  error?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  className?: string;
};

const sizeStyles: Record<InputSize, string> = {
  sm: "h-9 text-body-sm",
  md: "h-11 text-body-md",
  lg: "h-12 text-body-md",
};

const backgroundStyles: Record<InputVariant, string> = {
  outline: "bg-surface",
  filled: "bg-surface-muted",
};

const LTR_INPUT_TYPES = ["email", "url", "tel", "password", "number"];

/** Single text-field primitive: markup, states and a11y wiring live here only. */
export default function Input({
  variant = "outline",
  size = "md",
  label,
  hideLabel = false,
  hint,
  error,
  startAdornment,
  endAdornment,
  className,
  id,
  type,
  dir,
  required,
  ...inputProps
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const resolvedDir =
    dir ?? (type && LTR_INPUT_TYPES.includes(type) ? "ltr" : undefined);

  const borderStyles = error
    ? "border-danger"
    : variant === "filled"
      ? "border-transparent"
      : "border-border";

  // Hover must not repaint the border the focus utilities set.
  const hoverBorderStyles = error
    ? "hover:not-focus-visible:border-danger"
    : "hover:not-focus-visible:border-border-strong";

  // Padding only grows when an adornment actually occupies that side.
  const paddingStyles = cn(
    startAdornment ? "ps-10" : size === "sm" ? "ps-3" : "ps-3.5",
    endAdornment ? "pe-10" : size === "sm" ? "pe-3" : "pe-3.5",
  );

  return (
    <div className={cn("flex w-full flex-col gap-1.5 text-start", className)}>
      {label ? (
        <label
          htmlFor={inputId}
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
        <input
          id={inputId}
          type={type}
          dir={resolvedDir}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            "w-full rounded-control border text-foreground transition-shadow motion-fast placeholder:text-subtle-foreground",
            "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-subtle-foreground disabled:opacity-60",
            "read-only:cursor-default read-only:bg-surface-muted",
            // A forced-LTR field still shows a Persian placeholder on the reading side.
            resolvedDir === "ltr" && "placeholder-shown:text-end",
            sizeStyles[size],
            backgroundStyles[variant],
            borderStyles,
            hoverBorderStyles,
            error ? "focus-ring-error" : "focus-ring-soft",
            paddingStyles,
          )}
          {...inputProps}
        />
        {startAdornment ? (
          <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-muted-foreground">
            {startAdornment}
          </span>
        ) : null}
        {endAdornment ? (
          <span className="absolute inset-y-0 end-0 flex items-center pe-1.5">
            {endAdornment}
          </span>
        ) : null}
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
