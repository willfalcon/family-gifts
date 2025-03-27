'use client';

import { ErrorMessage } from '@/components/ErrorMessage';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { EventWithFamily } from '@/prisma/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarDays, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { dashboardGetEvents } from '../actions';

type Props = {
  success: boolean;
  message: string;
  events: EventWithFamily[];
  total: number | undefined;
};

type QueryFnReturn = {
  events: EventWithFamily[];
  total: number | undefined;
};

export default function DashboardUpcomingEvents({ success, message, events, total }: Props) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['dashboardGetEvents'],
    queryFn: async ({ pageParam }): Promise<QueryFnReturn> => {
      return await dashboardGetEvents(pageParam);
    },
    initialPageParam: false,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPageParam) return null;
      return true;
    },
    initialData: { pages: [{ events, total }], pageParams: [false] },
  });
  if (!success) {
    return <ErrorMessage title={message} />;
  }

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Upcoming Events</h2>

        <Link href="/dashboard/events" className={buttonVariants({ variant: 'outline' })}>
          See All
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.pages.map((page) =>
          page.events.map((event) => {
            return (
              <Card key={event.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{event.name}</CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {event.date && <div className="text-2xl font-bold">{format(event.date, 'MMM, d, yyyy')}</div>}
                  <p className="text-xs text-muted-foreground">{event.location}</p>
                </CardContent>
                <CardFooter>
                  <Link href={`/dashboard/event/${event.id}`} className={buttonVariants({ variant: 'outline', size: 'sm', className: 'w-full' })}>
                    View Details
                  </Link>
                </CardFooter>
              </Card>
            );
          }),
        )}
      </div>
      {hasNextPage && (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" onClick={() => fetchNextPage()} className="w-full max-w-xs" disabled={isFetchingNextPage}>
            {isFetchingNextPage && <Loader2 className="animate-spin mr-2" />}
            Show More <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  );
}
