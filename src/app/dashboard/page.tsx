import { Suspense } from "react";
import { requireUser } from "@/src/lib/dal";

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  await requireUser();

  return <h1>صفحه داشبورد</h1>;
}
