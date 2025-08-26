import { GetEvents } from '@/lib/queries/events';
import { formatDate } from '@/lib/utils';
import { CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';

export default function EventCard({ event }: { event: GetEvents[number] }) {
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
}
