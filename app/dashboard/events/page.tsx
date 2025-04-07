import { format } from 'date-fns';
import { auth } from '@/auth';
import Title from '@/components/Title';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CalendarDays, ChevronRight, Gift, Plus, Users } from 'lucide-react';
import { redirect } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import { getEvents } from '@/lib/queries/events';

export default async function EventsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const events = await getEvents();

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
      <div className="grid md:grid-cols-2 gap-4">
        {!!events.length &&
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
                <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={`/dashboard/events/${event.id}`}>
                  View Details
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}

        <Card className="border-dashed flex flex-col items-center justify-center p-8">
          <Calendar className="h-8 w-8 text-muted-foreground mb-4" />
          <h3 className="font-medium text-center mb-2">Plan an Event</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">Create an event and invite people</p>

          <Link href="/dashboard/events/new" className={buttonVariants()}>
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Link>
        </Card>
      </div>
    </div>
  );
}
