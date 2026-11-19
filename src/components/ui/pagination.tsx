import Link from "next/link";
import ChevronIcon from "@/src/components/icons/chevron-icon";
import { toPersianDigits } from "@/src/lib/utils/digits.utils";
import { cn } from "@/src/lib/utils/ui.utils";

type PaginationProps = {
  page: number;
  pageCount: number;
  getHref: (page: number) => string;
  className?: string;
};

type PageItem = number | "ellipsis";

function buildPageItems(page: number, pageCount: number): PageItem[] {
  const candidates = [1, page - 1, page, page + 1, pageCount].filter(
    (value) => value >= 1 && value <= pageCount,
  );
  const unique = [...new Set(candidates)].sort((a, b) => a - b);

  return unique.flatMap((value, index): PageItem[] => {
    const previous = unique[index - 1];

    if (previous !== undefined && value - previous > 1) {
      return ["ellipsis", value];
    }

    return [value];
  });
}

const itemBase =
  "inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-control px-2 text-body-sm motion-fast focus-ring";

export default function Pagination({
  page,
  pageCount,
  getHref,
  className,
}: PaginationProps) {
  const items = buildPageItems(page, pageCount);
  const hasPrevious = page > 1;
  const hasNext = page < pageCount;

  return (
    <nav
      aria-label="صفحه‌بندی"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      {hasPrevious ? (
        <Link href={getHref(page - 1)} className={cn(itemBase, "text-muted-foreground hover:bg-surface-muted hover:text-foreground")}>
          <ChevronIcon direction="start" className="size-4" />
          <span className="hidden sm:inline">قبلی</span>
        </Link>
      ) : (
        <span aria-disabled="true" className={cn(itemBase, "cursor-not-allowed text-subtle-foreground opacity-60")}>
          <ChevronIcon direction="start" className="size-4" />
          <span className="hidden sm:inline">قبلی</span>
        </span>
      )}

      {items.map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden="true"
            className="inline-flex h-9 min-w-6 items-center justify-center text-body-sm text-subtle-foreground"
          >
            …
          </span>
        ) : (
          <Link
            key={item}
            href={getHref(item)}
            aria-current={item === page ? "page" : undefined}
            className={cn(
              itemBase,
              item === page
                ? "bg-primary-soft font-medium text-primary-soft-foreground"
                : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
            )}
          >
            {toPersianDigits(String(item))}
          </Link>
        ),
      )}

      {hasNext ? (
        <Link href={getHref(page + 1)} className={cn(itemBase, "text-muted-foreground hover:bg-surface-muted hover:text-foreground")}>
          <span className="hidden sm:inline">بعدی</span>
          <ChevronIcon direction="end" className="size-4" />
        </Link>
      ) : (
        <span aria-disabled="true" className={cn(itemBase, "cursor-not-allowed text-subtle-foreground opacity-60")}>
          <span className="hidden sm:inline">بعدی</span>
          <ChevronIcon direction="end" className="size-4" />
        </span>
      )}
    </nav>
  );
}
