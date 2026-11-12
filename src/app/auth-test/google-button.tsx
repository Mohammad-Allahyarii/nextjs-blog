"use client";

import { useState } from "react";
import { authClient } from "@/src/lib/auth-client";

export function GoogleButton() {
  const [loading, setLoading] = useState(false);

  async function signIn() {
    setLoading(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
      newUserCallbackURL: "/dashboard",
    });
    // در حالت موفق، مرورگر به گوگل ریدایرکت می‌شود و این خط اجرا نمی‌شود
    if (error) {
      console.error(error);
      setLoading(false);
    }
  }

  return (
    <button type="button" className="cursor-pointer bg-primary rounded-full py-2 px-4 max-w-max" onClick={signIn} disabled={loading}>
      {loading ? "در حال انتقال..." : "ورود با گوگل"}
    </button>
  );
}