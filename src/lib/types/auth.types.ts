export type AuthStep = "email" | "otp";

/** Shared shape of a validated auth step, returned by both Server Actions. */
export type AuthFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  values?: { email?: string };
};

export const initialAuthFormState: AuthFormState = { status: "idle" };
