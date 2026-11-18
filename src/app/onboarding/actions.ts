"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/src/lib/auth";
import { hasCompleteName, requireSession } from "@/src/lib/dal";
import { profileSchema } from "@/src/lib/validations/profile.schema";
import type { ProfileFormState } from "@/src/lib/types/profile.types";

export async function completeOnboardingAction(
  _previousState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const session = await requireSession();

  // Onboarding is one-time: it must never work as an edit endpoint.
  if (hasCompleteName(session.user)) redirect("/dashboard");

  const parsed = profileSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
  });
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const { firstName, lastName } = parsed.data;

  try {
    await auth.api.updateUser({
      headers: await headers(),
      body: { name: `${firstName} ${lastName}`, firstName, lastName },
    });
  } catch (error) {
    console.error("[onboarding] failed to update user", error);
    return { formError: "ذخیره‌سازی انجام نشد. لطفاً دوباره تلاش کنید." };
  }

  // redirect() works by throwing, so it must stay outside try/catch.
  redirect("/dashboard");
}
