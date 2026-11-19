import Skeleton from "@/src/components/ui/skeleton";
import TableSkeleton from "@/src/components/ui/table-skeleton";

export default function Loading() {
  return (
    <div
      aria-busy="true"
      className="flex flex-col gap-section-dashboard px-gutter py-section-dashboard"
    >
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <Skeleton className="h-11 w-full md:max-w-sm" />
        <Skeleton className="h-11 w-full md:w-44" />
        <Skeleton className="h-11 w-full md:w-36" />
      </div>

      <TableSkeleton rows={6} columns={5} />
    </div>
  );
}
