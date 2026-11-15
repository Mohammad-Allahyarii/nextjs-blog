"use client";

import type { FormEvent } from "react";
import { Button } from "@/src/components/common/Button";
import FormField from "@/src/components/auth/form-field";

type OtpStepProps = {
  onOtpSubmit: (code: string) => void;
  onBack: () => void;
  onResend: () => void;
  isLoading: boolean;
  errorMessage?: string;
};

export default function OtpStep({
  onOtpSubmit,
  onBack,
  onResend,
  isLoading,
  errorMessage,
}: OtpStepProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const code = String(formData.get("code") ?? "");
    onOtpSubmit(code);
  }

  return (
    <>
      <header className="mb-6 flex flex-col gap-1 text-start md:mb-7">
        <h1 className="text-headline-sm text-foreground">تأیید نشانی ایمیل</h1>
        <p className="text-body-sm text-muted-foreground">
          کد ۶ رقمی ارسال‌شده به ایمیل خود را وارد کنید
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-5">
        <FormField
          id="otp"
          name="code"
          type="text"
          label="کد یکبارمصرف"
          placeholder="------"
          autoComplete="one-time-code"
          inputMode="numeric"
          maxLength={6}
          dir="ltr"
          inputClassName="text-center"
          error={errorMessage}
        />
        <Button type="submit" size="md" fullWidth loading={isLoading} className="mt-1">
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
