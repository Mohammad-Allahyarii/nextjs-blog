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

  // TODO(logic): send the OTP to the email here

  try {
    await auth.api.sendVerificationOTP({
      body: {
        email: email.trim().toLocaleLowerCase(),
        type: "sign-in",
      },
    });
  } catch (error) {
    console.log(result.data.email);
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
  const result = otpSchema.safeParse({ code });

  if (!result.success) {
    return {
      status: "error",
      fieldErrors: z.flattenError(result.error).fieldErrors,
    };
  }

  // TODO(logic): verify the OTP and create the session here
  try {
    await auth.api.signInEmailOTP({
      body: {
        email: email.trim().toLowerCase(),
        otp: code.trim(),
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
