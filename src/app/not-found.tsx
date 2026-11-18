import StatusPage from "@/src/components/common/status-page";

export default function NotFound() {
  return (
    <StatusPage
      code="خطای ۴۰۴"
      title="صفحه‌ای که به دنبال آن بودید پیدا نشد."
      description="ممکن است نشانی را اشتباه وارد کرده باشید یا این صفحه جابه‌جا شده باشد."
      action={{ href: "/", label: "بازگشت به صفحه‌ی اصلی" }}
    />
  );
}
