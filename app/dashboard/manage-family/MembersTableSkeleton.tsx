import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export default function MembersTableSkeleton({items}: {items: number}) {
  const rows = Array.from({length: items}, (_, i) => i);
  return rows.map((_, i) => (
    <TableRow key={i}>
      <TableCell><Skeleton className="h-6 w-full my-1" /></TableCell>
      <TableCell><Skeleton className="h-6 w-full my-1" /></TableCell>
      <TableCell><Skeleton className="h-6 w-full my-1" /></TableCell>
      <TableCell><Skeleton className="h-6 w-full my-1" /></TableCell>
    </TableRow>
  ))
}