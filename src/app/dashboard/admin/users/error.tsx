"use client";

import { Button } from "@/src/components/common/Button";

export default function UsersError({
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center gap-3 px-gutter py-section-dashboard text-center">
      <p className="text-label text-muted-foreground">خطا</p>
      <h1 className="text-headline-sm text-foreground">
        بارگذاری فهرست کاربران ناموفق بود.
      </h1>
      <p className="max-w-prose text-body-sm text-muted-foreground">
        مشکلی در دریافت اطلاعات رخ داد. می‌توانید دوباره تلاش کنید.
      </p>
      <Button onClick={() => retry()}>تلاش دوباره</Button>
    </div>
  );
}
