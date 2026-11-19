// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, emailOTP } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { after } from "next/server";
import { sendOtpEmail } from "@/src/lib/email";
import { db } from "@/src/lib/db";
import { ac, roles } from "@/src/lib/permissions";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!googleClientId) throw new Error("GOOGLE_CLIENT_ID is not set");
if (!googleClientSecret) throw new Error("GOOGLE_CLIENT_SECRET is not set");

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),

  // The admin plugin mounts /api/auth/admin/* endpoints that any signed-in
  // browser could call directly. Every mutation goes through the Server
  // Actions instead, which enforce the app's own guards. `disabledPaths` only
  // blocks the HTTP router, not in-process `auth.api.*` calls.
  disabledPaths: [
    "/admin/ban-user",
    "/admin/create-user",
    "/admin/get-user",
    "/admin/has-permission",
    "/admin/impersonate-user",
    "/admin/list-user-sessions",
    "/admin/list-users",
    "/admin/remove-user",
    "/admin/revoke-user-session",
    "/admin/revoke-user-sessions",
    "/admin/set-role",
    "/admin/set-user-password",
    "/admin/stop-impersonating",
    "/admin/unban-user",
    "/admin/update-user",
  ],

  user: {
    // `role` is NOT declared here: the admin plugin owns that field.
    additionalFields: {
      firstName: { type: "string", required: false, input: true },
      lastName: { type: "string", required: false, input: true },
    },
  },

  rateLimit: {
    storage: "database",
    customRules: {
      "/email-otp/send-verification-otp": { window: 60, max: 3 },
      "/sign-in/email-otp": { window: 60, max: 5 },
    },
  },

  socialProviders: {
    google: {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
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
      updateUserInfoOnLink: true,
    },
  },

  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 300, // seconds
      allowedAttempts: 3,
      async sendVerificationOTP({ email, otp, type }) {
        if (process.env.NODE_ENV === "development") {
          console.log(`[DEV] OTP for ${email} (${type}): ${otp}`);
        }
        // Do not await: awaiting makes the response time depend on whether the
        // email exists (timing attack). `after` runs the send once the response
        // has gone out, without the function being killed early.
        after(() => sendOtpEmail(email, otp, type).catch(console.error));
      },
    }),
    admin({
      ac,
      roles,
      defaultRole: "user",
      // Roles treated as full admins (for example, who may not be impersonated).
      adminRoles: ["admin"],
    }),
    nextCookies(), // must stay last in the list
  ],
});