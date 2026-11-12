import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP, admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { after } from "next/server";
import { sendOtpEmail } from "@/src/lib/email";
import { db } from "@/src/lib/db";

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),

  user: {
    additionalFields: {
      role: { type: "string", input: false, defaultValue: "user" },
      firstName: { type: "string", required: false, input: true },
      lastName: { type: "string", required: false, input: true },
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => ({
        firstName: profile.given_name,
        lastName: profile.family_name,
      }),
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },

  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 300, // ثانیه
      allowedAttempts: 3,
      async sendVerificationOTP({ email, otp, type }) {
        if (process.env.NODE_ENV === "development") {
          console.log(`[DEV] OTP for ${email} (${type}): ${otp}`);
        }
        // await نکن (جلوگیری از timing attack)؛ after باعث می‌شود
        // ارسال بعد از پاسخ و بدون کشته‌شدن تابع کامل شود.
        after(() => sendOtpEmail(email, otp, type).catch(console.error));
      },
    }),
    admin(), // تنظیمات قبلی admin خودت را اینجا نگه دار
    nextCookies(), // همیشه آخر لیست باشد
  ],
});
