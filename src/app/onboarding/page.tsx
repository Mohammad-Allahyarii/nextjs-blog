import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import AuthCard from "@/src/components/auth/auth-card";
import ProfileForm from "@/src/components/profile/profile-form";
import { hasCompleteName, requireSession } from "@/src/lib/dal";
import { completeOnboardingAction } from "./actions";

export const metadata: Metadata = {
  title: "تکمیل پروفایل",
  robots: { index: false, follow: false },
};

// The session read cannot be part of the static shell, so it streams in behind
// this boundary instead of blocking the whole page.
export default function OnboardingPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-gutter py-10">
      <Suspense fallback={null}>
        <OnboardingContent />
      </Suspense>
    </main>
  );
}

async function OnboardingContent() {
  const session = await requireSession();
  if (hasCompleteName(session.user)) redirect("/dashboard");

  return (
    <AuthCard>
      <header className="mb-6 flex flex-col gap-1 text-start md:mb-7">
        <h1 className="text-headline-sm text-foreground">تکمیل پروفایل</h1>
        <p className="text-body-sm text-muted-foreground">
          برای ادامه، نام و نام خانوادگی خود را وارد کنید. این نام کنار نوشته‌ها
          و نظرهای شما نمایش داده می‌شود.
        </p>
      </header>

      <ProfileForm
        action={completeOnboardingAction}
        initialValues={{
          firstName: session.user.firstName ?? "",
          lastName: session.user.lastName ?? "",
        }}
        submitLabel="ذخیره و ادامه"
      />
    </AuthCard>
  );
}
