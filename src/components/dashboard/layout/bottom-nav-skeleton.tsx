import Skeleton from "@/src/components/ui/skeleton";

const PLACEHOLDERS = ["first", "second", "third", "fourth"];

export default function BottomNavSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <div className="flex h-16 items-center justify-around gap-1 px-1">
        {PLACEHOLDERS.map((key) => (
          <Skeleton key={key} className="h-9 w-14" />
        ))}
      </div>
    </div>
  );
}
