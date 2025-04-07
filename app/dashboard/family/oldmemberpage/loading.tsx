import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export default function FamilyMemberLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Member Profile Header Loading State */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Skeleton className="h-24 w-24 rounded-full" />

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
              <div>
                <Skeleton className="h-10 w-48 mb-2" />
                <div className="flex items-center gap-2 mt-1">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-5 w-64 mt-2" />
              </div>

              <div className="flex gap-2">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>

            <Skeleton className="h-16 w-full mt-4" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-6 w-32 mt-2" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
