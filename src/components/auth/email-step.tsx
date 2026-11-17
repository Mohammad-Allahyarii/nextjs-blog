"use client";

import { useRef, useState } from "react";
import type { ChangeEvent, FocusEvent, FormEvent } from "react";
import { Button } from "@/src/components/common/Button";
import Input from "@/src/components/common/input";
import Divider from "@/src/components/auth/divider";
import GoogleButton from "@/src/components/auth/google-button";
import {
  emailSchema,
  getFirstError,
} from "@/src/lib/validations/auth.schema";
import type { EmailFormValues } from "@/src/lib/validations/auth.schema";
import type { AuthFormState } from "@/src/lib/types/auth.types";

type EmailStepProps = {
  action: (formData: FormData) => void;
  state: AuthFormState;
  isPending: boolean;
  onGoogleSignIn: () => void;
};

function validateEmail(email: string): string | undefined {
  const values: EmailFormValues = { email };
  return getFirstError(emailSchema, values, "email");
}

export default function EmailStep({
  action,
  state,
  isPending,
  onGoogleSignIn,
}: EmailStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [clientError, setClientError] = useState<string>();
  // Holds the server result the user has already moved on from, so an old
  // server error never reappears after an edit.
  const [dismissedErrorState, setDismissedErrorState] =
    useState<AuthFormState | null>(null);

  const serverError =
    state.status === "error" && state !== dismissedErrorState
      ? state.fieldErrors?.email?.[0]
      : undefined;
  const error = clientError ?? serverError;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const email = inputRef.current?.value ?? "";
    const validationError = validateEmail(email);

    if (validationError) {
      // Blocking the submit keeps the Server Action from being called at all.
      event.preventDefault();
      setClientError(validationError);
      inputRef.current?.focus();
      return;
    }

    setClientError(undefined);
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    setDismissedErrorState(state);
    setClientError(validateEmail(event.currentTarget.value));
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setDismissedErrorState(state);
    // Re-check only once an error is visible, so a first attempt never flickers.
    if (clientError) setClientError(validateEmail(event.currentTarget.value));
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

      <form
        action={action}
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4 md:gap-5"
      >
        <Input
          ref={inputRef}
          id="email"
          name="email"
          type="email"
          label="نشانی ایمیل"
          placeholder="name@domain.com"
          autoComplete="email"
          inputMode="email"
          dir="ltr"
          defaultValue={state.values?.email}
          disabled={isPending}
          error={error}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        <Button
          type="submit"
          size="md"
          fullWidth
          loading={isPending}
          className="mt-1"
        >
          ورود به حساب
        </Button>
      </form>

      <Divider />

      <GoogleButton onClick={onGoogleSignIn} />
    </>
  );
}
