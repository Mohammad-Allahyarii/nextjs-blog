import { z } from "zod";

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 50;

// Letters, combining marks and ZWNJ, optionally separated by a single space, apostrophe or hyphen.
const NAME_PATTERN = /^[\p{L}\p{M}\u200C]+(?:[ '\u2019-][\p{L}\p{M}\u200C]+)*$/u;

// Trim, collapse inner whitespace, and convert Arabic Yeh/Kaf to Persian forms.
export function normalizeName(value: string): string {
  return value
    .normalize("NFC")
    .replace(/\u064A/g, "\u06CC")
    .replace(/\u0643/g, "\u06A9")
    .replace(/\s+/g, " ")
    .trim();
}

function nameField(label: string) {
  return z
    .string({ error: `${label} را وارد کنید.` })
    .transform(normalizeName)
    .pipe(
      z
        .string()
        .min(1, { error: `${label} را وارد کنید.` })
        .min(NAME_MIN_LENGTH, {
          error: `${label} باید حداقل ${NAME_MIN_LENGTH} حرف باشد.`,
        })
        .max(NAME_MAX_LENGTH, {
          error: `${label} نمی‌تواند بیشتر از ${NAME_MAX_LENGTH} حرف باشد.`,
        })
        .regex(NAME_PATTERN, {
          error: `${label} فقط می‌تواند شامل حروف باشد (عدد و نماد مجاز نیست).`,
        }),
    );
}

export const profileSchema = z.object({
  firstName: nameField("نام"),
  lastName: nameField("نام خانوادگی"),
});

export type ProfileInput = z.infer<typeof profileSchema>;
