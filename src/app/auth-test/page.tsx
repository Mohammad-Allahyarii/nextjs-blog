// app/(auth)/login/login-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";
import { GoogleButton } from "@/src/app/auth-test/google-button";

export default function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: email.trim().toLocaleLowerCase(),
      type: "sign-in",
    });
    setLoading(false);
    if (error) return setError(error.message ?? "ارسال کد ناموفق بود");
    setStep("otp");
  }

 async function verify(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);
  setError(null);

  const { error } = await authClient.signIn.emailOtp({
    email: email.trim().toLowerCase(),
    otp: otp.trim(),
  });

  setLoading(false);
  if (error) {
    console.log(error); // code و message را اینجا می‌بینی
    return setError(error.message ?? "کد نامعتبر است");
  }
  router.replace("/dashboard");
  router.refresh();
}

  return step === "email" ? (
    <>
    <form onSubmit={sendCode}>
      <input type="email" required value={email} className="border border-blue-400"
             onChange={(e) => setEmail(e.target.value)} placeholder="ایمیل" />
      <button className={`bg-primary text-white p-2 rounded-sm ${loading ? "bg-primary/50" : ""}`} disabled={loading}>ارسال کد</button>
      {error && <p>{error}</p>}
    </form>
    <GoogleButton />
    </>
  ) : (
    <form onSubmit={verify}>
      <input inputMode="numeric" maxLength={6} required value={otp} className="border border-blue-400"
             onChange={(e) => setOtp(e.target.value)} placeholder="کد ۶ رقمی" />
      <button className="bg-primary text-white p-2 rounded-sm" disabled={loading}>ورود</button>
      <button className="bg-primary text-white p-2 rounded-sm" type="button" onClick={() => setStep("email")}>تغییر ایمیل</button>
      {error && <p>{error}</p>}
    </form>
  );
}8