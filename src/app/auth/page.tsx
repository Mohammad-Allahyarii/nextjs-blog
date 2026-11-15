import type { Metadata } from "next";
import AuthFlow from "@/src/components/auth/auth-flow";

export const metadata: Metadata = {
  title: "ورود به حساب کاربری",
  description: "ورود به حساب کاربری برای نوشتن و ثبت دیدگاه",
};

export default function AuthPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-gutter py-10">
      <AuthFlow />
    </main>
  );
}
