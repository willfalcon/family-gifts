import { Skeleton } from '@/components/ui/skeleton';

export default function NotificationsLoading() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>

      <div className="mb-4">
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="grid gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-3 w-3 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-2 h-3 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
