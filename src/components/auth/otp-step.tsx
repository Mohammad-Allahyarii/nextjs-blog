"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/src/components/common/Button";
import OtpInput from "@/src/components/auth/otp-input";
import FormError from "@/src/components/auth/form-error";
import { toPersianDigits } from "@/src/lib/utils/digits.utils";
import {
  OTP_LENGTH,
  getFirstError,
  otpSchema,
} from "@/src/lib/validations/auth.schema";
import type { OtpFormValues } from "@/src/lib/validations/auth.schema";
import type { AuthFormState } from "@/src/lib/types/auth.types";

type OtpStepProps = {
  action: (formData: FormData) => void;
  state: AuthFormState;
  isPending: boolean;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  onBack: () => void;
  onResend: () => void;
  email?: string;
  length?: number;
};

function validateCode(code: string): string | undefined {
  const values: OtpFormValues = { code };
  return getFirstError(otpSchema, values, "code");
}

export default function OtpStep({
  action,
  state,
  isPending,
  value,
  onChange,
  onComplete,
  onBack,
  onResend,
  email,
  length = OTP_LENGTH,
}: OtpStepProps) {
  const boxesRef = useRef<HTMLDivElement>(null);
  const [clientError, setClientError] = useState<string>();
  // Holds the server result the user has already moved on from, so an old
  // server error never reappears after an edit.
  const [dismissedErrorState, setDismissedErrorState] =
    useState<AuthFormState | null>(null);

  const serverError =
    state.status === "error" && state !== dismissedErrorState
      ? state.fieldErrors?.code?.[0]
      : undefined;
  const error = clientError ?? serverError;
  const errorId = "otp-error";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const validationError = validateCode(value);

    if (validationError) {
      event.preventDefault();
      setClientError(validationError);
      // OtpInput has no focus API, so the first box is focused through the DOM.
      boxesRef.current?.querySelector<HTMLInputElement>("input")?.focus();
      return;
    }

    setClientError(undefined);
  }

  function handleChange(nextValue: string) {
    onChange(nextValue);
    setDismissedErrorState(state);
    if (clientError) setClientError(validateCode(nextValue));
  }

  function handleComplete(completedCode: string) {
    // TODO(logic): decide here if the code should be submitted automatically
    onComplete?.(completedCode);
  }

  return (
    <>
      <header className="mb-6 flex flex-col gap-1 text-start md:mb-7">
        <h1 className="text-headline-sm text-foreground">تأیید نشانی ایمیل</h1>
        <p className="text-body-sm text-muted-foreground">
          کد {toPersianDigits(String(length))} رقمی ارسال‌شده به{" "}
          <span dir="ltr" className="font-medium text-foreground">
            {email ?? "ایمیل شما"}
          </span>{" "}
          را وارد کنید
        </p>
      </header>

      <form
        action={action}
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4 md:gap-5"
      >
        <input type="hidden" name="code" value={value} />

        <div ref={boxesRef} className="flex flex-col gap-1.5 text-start">
          <span id="otp-label" className="text-body-sm font-medium text-foreground">
            کد یکبارمصرف
          </span>
          <div
            role="group"
            aria-labelledby="otp-label"
            aria-describedby={error ? errorId : undefined}
          >
            <OtpInput
              label="کد یکبارمصرف"
              value={value}
              onChange={handleChange}
              onComplete={handleComplete}
              length={length}
              hasError={Boolean(error)}
              disabled={isPending}
            />
          </div>
          {error ? <FormError id={errorId}>{error}</FormError> : null}
        </div>

        <Button
          type="submit"
          size="md"
          fullWidth
          loading={isPending}
          className="mt-1"
        >
          تأیید و ورود
        </Button>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-1 md:mt-7">
        <Button variant="ghost" size="sm" onClick={onBack}>
          تغییر نشانی ایمیل
        </Button>
        <span aria-hidden="true" className="size-1 rounded-chip bg-border-strong" />
        <Button variant="ghost" size="sm" onClick={onResend}>
          ارسال دوباره کد
        </Button>
      </div>
    </>
  );
}
