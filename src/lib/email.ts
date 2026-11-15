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
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY is not set");
    }
    console.warn(
      "[DEV] RESEND_API_KEY تنظیم نشده؛ ایمیل ارسال نشد (کد در لاگ بالا است)",
    );
    return;
  }

  console.log("OTP", otp);

  // const resend = new Resend(apiKey);
  // const { error } = await resend.emails.send({
  //   from: "Blog <onboarding@resend.dev>", // برای تست؛ بعداً دامنهٔ خودت
  //   to: email,
  //   subject: subjects[type],
  //   html: `
  //     <div dir="rtl" style="font-family: Tahoma, sans-serif">
  //       <p>کد شما:</p>
  //       <p style="font-size:24px;font-weight:bold;letter-spacing:4px">${otp}</p>
  //       <p>این کد تا ۵ دقیقه معتبر است. اگر شما درخواست نداده‌اید، این ایمیل را نادیده بگیرید.</p>
  //     </div>`,
  // });

  // if (error) {
  //   throw new Error(`Resend error: ${error.message}`);
  // }
}
