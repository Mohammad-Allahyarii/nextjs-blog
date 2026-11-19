import Skeleton from "@/src/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";

type TableSkeletonProps = {
  rows?: number;
  columns?: number;
  className?: string;
};

export default function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: TableSkeletonProps) {
  const columnIndexes = Array.from({ length: columns }, (_, index) => index);
  const rowIndexes = Array.from({ length: rows }, (_, index) => index);

  return (
    <div className={className}>
      <Table caption="در حال بارگذاری فهرست">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columnIndexes.map((column) => (
              <TableHead key={column}>
                <Skeleton className="h-3 w-16" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rowIndexes.map((row) => (
            <TableRow key={row} className="hover:bg-transparent">
              {columnIndexes.map((column) => (
                <TableCell key={column}>
                  <Skeleton className="h-4 w-full max-w-40" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
