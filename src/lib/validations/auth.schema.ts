import { z } from "zod";
import { toPersianDigits } from "@/src/lib/utils/digits.utils";

/** Single source for the code length: the UI, client check and server check all read it. */
export const OTP_LENGTH = 6;

const EMAIL_REQUIRED = "لطفاً ایمیل خود را وارد کنید";
const CODE_REQUIRED = "لطفاً کد تأیید را وارد کنید";

export const emailSchema = z.object({
  email: z
    .string({ error: EMAIL_REQUIRED })
    .trim()
    .min(1, { error: EMAIL_REQUIRED })
    // Checking emptiness before the format keeps the "required" message for an empty field.
    .pipe(z.email({ error: "ایمیل واردشده معتبر نیست" })),
});

export const otpSchema = z.object({
  code: z
    .string({ error: CODE_REQUIRED })
    .trim()
    .min(1, { error: CODE_REQUIRED })
    .regex(/^[0-9]+$/, { error: "کد فقط شامل رقم است" })
    .length(OTP_LENGTH, {
      error: `کد باید ${toPersianDigits(String(OTP_LENGTH))} رقم باشد`,
    }),
});

export type EmailFormValues = z.infer<typeof emailSchema>;
export type OtpFormValues = z.infer<typeof otpSchema>;

export function getFirstError<T>(
  schema: z.ZodType<T>,
  data: unknown,
  field: Extract<keyof T, string>,
): string | undefined {
  const result = schema.safeParse(data);
  if (result.success) return undefined;
  return z.flattenError(result.error).fieldErrors[field]?.[0];
}
