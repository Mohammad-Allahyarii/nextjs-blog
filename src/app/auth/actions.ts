"use server";

import { z } from "zod";
import { emailSchema, otpSchema } from "@/src/lib/validations/auth.schema";
import type { AuthFormState } from "@/src/lib/types/auth.types";

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
  return { status: "success", values: { email: result.data.email } };
}

// Always validate on the server; client validation can be bypassed.
export async function verifyOtpAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const rawCode = formData.get("code");
  const code = typeof rawCode === "string" ? rawCode : "";
  const result = otpSchema.safeParse({ code });

  if (!result.success) {
    return {
      status: "error",
      fieldErrors: z.flattenError(result.error).fieldErrors,
    };
  }

  // TODO(logic): verify the OTP and create the session here
  return { status: "success" };
}
