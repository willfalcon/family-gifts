import { format } from 'date-fns';
import { auth } from '@/auth';
import Title from '@/components/Title';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getEvents } from '@/prisma/queries';
import { CalendarDays, ChevronRight, Gift, Users } from 'lucide-react';
import { redirect } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import SetBreadcrumbs from '@/components/SetBreadcrumbs';

export default async function EventsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const { events, success, message } = await getEvents();

  if (!success) {
    return (
      <div>
        <h3>Event query failed.</h3>
        <p>{message}</p>
      </div>
    );
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'gathering':
        return <Users className="h-4 w-4" />;
      case 'party':
        return <CalendarDays className="h-4 w-4" />;
      case 'secretSanta':
        return <Gift className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4 p-8 pt-6">
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Events', href: '/dashboard/events' },
        ]}
      />
      <Title>Events</Title>
      {events.length ? (
        events.map((event) => (
          <Card key={event.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{event.name}</CardTitle>
              <Badge variant="secondary">
                {getEventIcon('gathering')}
                <span className="ml-1 capitalize">gathering</span>
              </Badge>
            </CardHeader>
            <CardContent>
              {event.date && <div className="text-sm text-muted-foreground mb-2">{format(new Date(event.date), 'MMMM dd, yyyy')}</div>}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={`/dashboard/event/${event.id}`}>
                View Details
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        ))
      ) : (
        <p>{message}</p>
      )}
      <Link href="/dashboard/events/new" className={buttonVariants()}>
        Create New Event
      </Link>
    </div>
  );
}
