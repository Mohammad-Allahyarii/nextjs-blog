"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { BLOG_NAME } from "@/src/lib/constants/initial.constants";
import { initialAuthFormState } from "@/src/lib/types/auth.types";
import type { AuthFormState, AuthStep } from "@/src/lib/types/auth.types";
import { requestOtpAction, verifyOtpAction } from "@/src/app/auth/actions";
import AuthCard from "@/src/components/auth/auth-card";
import EmailStep from "@/src/components/auth/email-step";
import OtpStep from "@/src/components/auth/otp-step";
import FormError from "@/src/components/common/form-error";

type AuthFlowProps = {
  onGoogleSignIn?: () => void;
  onResend?: () => void;
  signupHref?: string;
};

export default function AuthFlow({
  onGoogleSignIn,
  onResend,
  signupHref = "/signup",
}: AuthFlowProps) {
  const [emailState, submitEmail, isEmailPending] = useActionState(
    requestOtpAction,
    initialAuthFormState,
  );
  const [otpState, submitOtp, isOtpPending] = useActionState(
    verifyOtpAction,
    initialAuthFormState,
  );
  const [code, setCode] = useState("");
  // Holds the exact result the user backed out of: a newer result wins again,
  // so no effect is needed to move between steps.
  const [dismissedEmailState, setDismissedEmailState] =
    useState<AuthFormState | null>(null);

  const step: AuthStep =
    emailState.status === "success" && emailState !== dismissedEmailState
      ? "otp"
      : "email";
  const message = step === "otp" ? otpState.message : emailState.message;

  function handleBack() {
    setCode("");
    setDismissedEmailState(emailState);
  }

  function handleResend() {
    // TODO(logic): resend the code to the stored email
    onResend?.();
  }

  function handleGoogleSignIn() {
    // TODO(logic): connect Google sign-in here
    onGoogleSignIn?.();
  }

  return (
    <div className="flex w-full flex-col items-center">
      <Link
        href="/"
        className="mb-6 inline-block rounded-control text-headline-md text-foreground focus-ring md:mb-8"
      >
        {BLOG_NAME}
      </Link>

      <AuthCard>
        {message ? (
          <div className="mb-4">
            <FormError>{message}</FormError>
          </div>
        ) : null}

        {step === "email" ? (
          <EmailStep
            action={submitEmail}
            state={emailState}
            isPending={isEmailPending}
            onGoogleSignIn={handleGoogleSignIn}
            signupHref={signupHref}
          />
        ) : (
          <OtpStep
            action={submitOtp}
            state={otpState}
            isPending={isOtpPending}
            value={code}
            onChange={setCode}
            onBack={handleBack}
            onResend={handleResend}
            email={emailState.values?.email}
          />
        )}
      </AuthCard>
    </div>
  );
}
