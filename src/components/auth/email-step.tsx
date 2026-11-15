"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/src/components/common/Button";
import FormField from "@/src/components/auth/form-field";
import Divider from "@/src/components/auth/divider";
import GoogleButton from "@/src/components/auth/google-button";


type EmailStepProps = {
  onEmailSubmit: (email: string) => void;
  onGithubSignIn: () => void;
  isLoading: boolean;
  errorMessage?: string;
  signupHref: string;
};

export default function EmailStep({
  onEmailSubmit,
  onGithubSignIn,
  isLoading,
  errorMessage,
  signupHref,
}: EmailStepProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    onEmailSubmit(email);
  }

  return (
    <>
      <header className="mb-6 flex flex-col gap-1 text-start md:mb-7">
        <h1 className="text-headline-sm text-foreground">
          ورود به حساب کاربری
        </h1>
        <p className="text-body-sm text-muted-foreground">
          برای نوشتن و ثبت دیدگاه وارد شوید
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-5">
        <FormField
          id="email"
          name="email"
          type="email"
          label="نشانی ایمیل"
          placeholder="name@domain.com"
          autoComplete="email"
          inputMode="email"
          dir="ltr"
          error={errorMessage}
        />
        <Button
          type="submit"
          size="md"
          fullWidth
          loading={isLoading}
          className="mt-1"
        >
          ورود به حساب
        </Button>
      </form>

      <Divider />

      <GoogleButton onClick={onGithubSignIn} />
    </>
  );
}
