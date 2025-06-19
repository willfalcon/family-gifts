'use client';

import { Event } from '@prisma/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Calendar, CalendarDays, ChevronDown, ChevronRight, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';

import { formatDate } from '@/lib/utils';
import { dashboardGetEvents } from '../actions';

import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  events: Event[];
  total: number | undefined;
};

type QueryFnReturn = {
  events: Event[];
  total: number | undefined;
};

export default function EventsSection({ events, total }: Props) {
  const hasMore = total && total > events.length;

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['dashboardGetEvents'],
    queryFn: async ({ pageParam }): Promise<QueryFnReturn> => {
      return await dashboardGetEvents(pageParam);
    },
    initialPageParam: false,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPageParam || !hasMore) return null;
      return true;
    },
    initialData: { pages: [{ events, total }], pageParams: [false] },
  });

  return (
    <section className="mb-10 w-full @container">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Upcoming Events</h2>

        <Link href="/dashboard/events" className={buttonVariants({ variant: 'outline' })}>
          See All
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 @lg:grid-cols-2 @3xl:grid-cols-3">
        {data?.pages.map((page) =>
          page.events.map((event) => {
            return (
              <Card key={event.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{event.name}</CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {event.date && <div className="text-2xl font-bold">{formatDate(event.date)}</div>}
                  <p className="text-xs text-muted-foreground">{event.location}</p>
                </CardContent>
                <CardFooter>
                  <Link href={`/dashboard/events/${event.id}`} className={buttonVariants({ variant: 'outline', size: 'sm', className: 'w-full' })}>
                    View Details
                  </Link>
                </CardFooter>
              </Card>
            );
          }),
        )}
        {total === 0 && (
          <Card className="border-dashed flex flex-col items-center justify-center p-8">
            <Calendar className="h-8 w-8 text-muted-foreground mb-4" />
            <h3 className="font-medium text-center mb-2">Plan an Event</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">Create an event and invite people</p>

            <Link href="/dashboard/events/new" className={buttonVariants()}>
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Link>
          </Card>
        )}

        {hasNextPage && (
          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={() => fetchNextPage()} className="w-full max-w-xs" disabled={isFetchingNextPage}>
              {isFetchingNextPage && <Loader2 className="animate-spin mr-2" />}
              Show More <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
