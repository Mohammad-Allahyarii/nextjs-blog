// src/lib/email.ts
import { Resend } from "resend";

type OtpType =
  | "sign-in"
  | "email-verification"
  | "forget-password"
  | "change-email";

const subjects: Record<OtpType, string> = {
  "sign-in": "کد ورود شما",
  "email-verification": "کد تأیید ایمیل",
  "forget-password": "کد بازیابی رمز عبور",
  "change-email": "کد تغییر ایمیل",
};

export async function sendOtpEmail(email: string, otp: string, type: OtpType) {
  // In development auth.ts prints the code to the terminal, so no email is
  // sent. The code is never logged here, otherwise it would end up in
  // production logs.
  if (process.env.NODE_ENV === "development") return;

  const apiKey = process.env.RESEND_API_KEY;
  // Must be an address on a domain verified in Resend,
  // e.g. "Blog <noreply@yourdomain.com>". The onboarding@resend.dev sender
  // only delivers to your own Resend account email.
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    throw new Error("RESEND_API_KEY and EMAIL_FROM must be set");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: email,
    subject: subjects[type],
    text: `کد شما: ${otp}\nاین کد تا ۵ دقیقه معتبر است.`,
    html: `
      <div dir="rtl" style="font-family: Tahoma, sans-serif">
        <p>کد شما:</p>
        <p style="font-size:24px;font-weight:bold;letter-spacing:4px">${otp}</p>
        <p>این کد تا ۵ دقیقه معتبر است. اگر شما درخواست نداده‌اید، این ایمیل را نادیده بگیرید.</p>
      </div>`,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}