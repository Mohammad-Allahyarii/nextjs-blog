import StatusPage from "@/src/components/common/status-page";

const Forbidden = () => {
  return (
    <StatusPage
      code="خطای ۴۰۳"
      title="اجازه‌ی دسترسی به این صفحه را ندارید."
      description="حساب شما به این بخش از میز کار دسترسی ندارد. اگر فکر می‌کنید اشتباهی رخ داده است، با مدیر سامانه تماس بگیرید."
      action={{ href: "/", label: "بازگشت به صفحه‌ی اصلی" }}
    />
  );
};

export default Forbidden;
