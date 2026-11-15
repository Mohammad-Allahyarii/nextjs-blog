"use client";

import { useState } from "react";
import Link from "next/link";
import { BLOG_NAME } from "@/src/lib/constants/initial.constants";
import type { AuthStep } from "@/src/lib/types/auth.types";
import AuthCard from "@/src/components/auth/auth-card";
import EmailStep from "@/src/components/auth/email-step";
import OtpStep from "@/src/components/auth/otp-step";

type AuthFlowProps = {
  onEmailSubmit?: (email: string) => void;
  onOtpSubmit?: (code: string) => void;
  onBack?: () => void;
  onResend?: () => void;
  onGithubSignIn?: () => void;
  isLoading?: boolean;
  errorMessage?: string;
  signupHref?: string;
};

export default function AuthFlow({
  onEmailSubmit,
  onOtpSubmit,
  onBack,
  onResend,
  onGithubSignIn,
  isLoading = false,
  errorMessage,
  signupHref = "/signup",
}: AuthFlowProps) {
  // Placeholder step switching for UI preview only. Replace with real logic.
  const [step, setStep] = useState<AuthStep>("email");

  function handleEmailSubmit(email: string) {
    // TODO(logic): connect email submit here
    onEmailSubmit?.(email);
    setStep("otp");
  }

  function handleOtpSubmit(code: string) {
    // TODO(logic): connect OTP submit here
    onOtpSubmit?.(code);
  }

  function handleBack() {
    // TODO(logic): connect back / change email here
    onBack?.();
    setStep("email");
  }

  function handleResend() {
    // TODO(logic): connect resend code here
    onResend?.();
  }

  function handleGithubSignIn() {
    // TODO(logic): connect GitHub sign-in here
    onGithubSignIn?.();
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
        {step === "email" ? (
          <EmailStep
            onEmailSubmit={handleEmailSubmit}
            onGithubSignIn={handleGithubSignIn}
            isLoading={isLoading}
            errorMessage={errorMessage}
            signupHref={signupHref}
          />
        ) : (
          <OtpStep
            onOtpSubmit={handleOtpSubmit}
            onBack={handleBack}
            onResend={handleResend}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
        )}
      </AuthCard>
    </div>
  );
}
