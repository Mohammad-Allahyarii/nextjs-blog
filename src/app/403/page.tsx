import Link from "next/link";

const Forbidden = () => {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-5 text-center">
      <p className="text-label text-muted-foreground">خطای ۴۰۳</p>
      <h1 className="text-headline-sm text-foreground">
        اجازه‌ی دسترسی به این صفحه را ندارید.
      </h1>
      <p className="max-w-prose text-body-md text-muted-foreground">
        حساب شما به این بخش از میز کار دسترسی ندارد. اگر فکر می‌کنید اشتباهی رخ
        داده است، با مدیر سامانه تماس بگیرید.
      </p>
      <Link
        href="/"
        className="motion-fast focus-ring rounded-control bg-primary px-4 py-2 text-label text-on-primary hover:bg-primary-hover"
      >
        بازگشت به صفحه‌ی اصلی
      </Link>
    </main>
  );
};

export default Forbidden;
