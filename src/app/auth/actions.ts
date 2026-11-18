"use server";

import { z } from "zod";
import { emailSchema, otpSchema } from "@/src/lib/validations/auth.schema";
import type { AuthFormState } from "@/src/lib/types/auth.types";
import { auth } from "@/src/lib/auth";
import { isAPIError } from "better-auth/api";

// Always validate on the server; client validation can be bypassed.
export async function requestOtpAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const rawEmail = formData.get("email");
  const email = typeof rawEmail === "string" ? rawEmail : "";
  const result = emailSchema.safeParse({ email });

  if (!result.success) {
    return {
      status: "error",
      fieldErrors: z.flattenError(result.error).fieldErrors,
      values: { email },
    };
  }

  try {
    await auth.api.sendVerificationOTP({
      body: {
        email: email.trim().toLocaleLowerCase(),
        type: "sign-in",
      },
    });
  } catch {
    console.error("requestOtpAction failed");
    return {
      status: "error",
      message: "ارسال کد تایید ناموفق بود.",
      values: { email: result.data.email },
    };
  }

  return { status: "success", values: { email: result.data.email } };
}

// Always validate on the server; client validation can be bypassed.
export async function verifyOtpAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const rawCode = formData.get("code");
  const rawEmail = formData.get("email");
  const code = typeof rawCode === "string" ? rawCode : "";
  const email = typeof rawEmail === "string" ? rawEmail : "";

  const emailResult = emailSchema.safeParse({ email });
  const codeResult = otpSchema.safeParse({ code });

  if (!emailResult.success || !codeResult.success) {
    return {
      status: "error",
      fieldErrors: {
        ...(emailResult.success
          ? {}
          : z.flattenError(emailResult.error).fieldErrors),
        ...(codeResult.success ? {} : z.flattenError(codeResult.error).fieldErrors),
      },
    };
  }

  try {
    await auth.api.signInEmailOTP({
      body: {
        email: emailResult.data.email.toLocaleLowerCase(),
        otp: codeResult.data.code,
      },
    });
  } catch (error) {
    console.error("OTP verification failed:", error);

    const message = isAPIError(error)
      ? error.message
      : "کد وارد شده نامعتبر است یا منقضی شده است.";

    return { status: "error", message };
  }

  return { status: "success" };
}
