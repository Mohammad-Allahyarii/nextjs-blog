import { Suspense } from "react";
import { requirePermission } from "@/src/lib/dal";

export default function AdminOverviewPage() {
  return (
    <Suspense fallback={null}>
      <AdminOverviewContent />
    </Suspense>
  );
}

async function AdminOverviewContent() {
  await requirePermission({ adminPanel: ["access"] });

  return (
    <div className="flex flex-col gap-2 px-gutter py-section-dashboard">
      <h1 className="text-headline-md text-foreground">نمای کلی مدیریت</h1>
      <p className="text-body-md text-muted-foreground">
        این بخش به‌زودی آماده می‌شود.
      </p>
    </div>
  );
}
