import Skeleton from "@/src/components/ui/skeleton";

export default function SidebarNavSkeleton() {
  return (
    <div className="flex flex-col gap-1 px-1">
      <Skeleton className="mb-1 h-3 w-24" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="mb-1 mt-4 h-3 w-20" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
    </div>
  );
}
