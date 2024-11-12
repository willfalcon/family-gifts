import { CalendarDays } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { getEvents, getEventsCount } from '@/lib/queries/events';

export default async function UpcomingEvents() {
  const { count } = await getEventsCount();

  if (!count || count === 0) {
    return null;
  }
  const { events } = await getEvents(1);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
        <CalendarDays className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        {events.length > 0 && <p className="text-xs text-muted-foreground">Next: {events[0].name}</p>}
      </CardContent>
    </Card>
  );
}
