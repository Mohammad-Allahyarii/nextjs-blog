import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/utils";


/**
 * Button — فقط با توکن‌های globals.css (بدون hex خام).
 *
 * Variants:
 *  - primary   : کنش اصلی صفحه (طبق Single Accent Rule در هر viewport فقط یکی)
 *  - soft      : کنش ثانویه با رنگ برند (چیپ/هایلایت ملایم)
 *  - secondary : کنش ثانویه خنثی
 *  - outline   : کنش کم‌اهمیت‌تر با حاشیه
 *  - ghost     : کنش‌های سطح سوم (نوار ابزار، منو)
 *  - danger    : کنش مخرب (حذف و ...)
 *  - link      : شبیه لینک متنی
 *
 * Sizes: sm | md | lg | icon-sm | icon | icon-lg
 */
const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2",
    "whitespace-nowrap font-medium select-none",
    "rounded-control focus-ring motion-fast",
    "active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-busy:cursor-progress",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    // آیکون‌ها در RTL با حالت LTR برعکس نشوند مگر اینکه خودتان بخواهید
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary! hover:bg-primary-hover",
        soft: "bg-primary-soft text-primary-soft-foreground hover:bg-primary-soft/70",
        secondary:
          "bg-surface-muted text-foreground hover:bg-border",
        outline:
          "border border-border-strong bg-surface text-foreground hover:bg-surface-muted",
        ghost:
          "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
        // text-on-primary روی danger در هر دو تم کنتراست ≥ 4.5 دارد (محاسبه‌شده).
        // توکن --danger-hover در globals.css نیست؛ فعلاً با opacity.
        danger: "bg-danger text-on-primary hover:opacity-90",
        link: "h-auto rounded-none p-0 text-primary underline-offset-4 hover:text-primary-hover hover:underline active:scale-100",
      },
      size: {
        sm: "h-9 px-3 text-body-sm [&_svg]:size-4",
        md: "h-11 px-5 text-body-md [&_svg]:size-5",
        lg: "h-12 px-7 text-body-md [&_svg]:size-5",
        "icon-sm": "size-9 text-body-sm [&_svg]:size-4",
        icon: "size-11 [&_svg]:size-5",
        "icon-lg": "size-12 [&_svg]:size-6",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  },
);

function Spinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="animate-spin"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
        opacity="0.25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  /** وضعیت در حال انجام: دکمه غیرفعال می‌شود و اسپینر نشان می‌دهد */
  loading?: boolean;
}

// React 19: ref مثل prop عادی پاس داده می‌شود، forwardRef لازم نیست.
// اگر React 18 دارید، کامپوننت را با React.forwardRef بپیچید.
function Button({
  className,
  variant,
  size,
  fullWidth,
  loading = false,
  disabled,
  type = "button", // پیش‌فرض امن: داخل <form> سابمیت ناخواسته نمی‌کند
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export { Button, buttonVariants };