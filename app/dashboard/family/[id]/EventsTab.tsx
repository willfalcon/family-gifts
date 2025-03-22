import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TabsContent } from '@/components/ui/tabs';
import { EventFromGetFamily, MemberFromGetFamily } from '@/lib/queries/families';
import { Event } from '@prisma/client';
import { format } from 'date-fns';
import { CalendarDays, Gift, Plus, Search } from 'lucide-react';
import Link from 'next/link';

type Props = {
  members: MemberFromGetFamily[];
};

export default function EventsTab({ members }: Props) {
  const relatedEvents = members.reduce<EventFromGetFamily[]>((events, member) => {
    member.events.forEach((event) => {
      if (!events.find((e) => e.id === event.id)) {
        events.push(event);
      }
    });
    return events;
  }, []);
  return (
    <TabsContent value="events" className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Events</CardTitle>
            <CardDescription>Events involving family members</CardDescription>
          </div>

          <Link href="/dashboard/events/new" className={buttonVariants({ size: 'sm' })}>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </CardHeader>
        <CardContent>
          <div className="relative w-full mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search events..." className="w-full pl-8" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {relatedEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{event.name}</CardTitle>
                    {!!event._count.assignments && (
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                        <Gift className="h-3 w-3 mr-1" />
                        Secret Santa
                      </Badge>
                    )}
                  </div>
                  {event.date && <CardDescription>{format(event.date, 'MM, dd, yyyy')}</CardDescription>}
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center gap-1 flex-wrap mt-2">
                    <span className="text-sm text-muted-foreground mr-1">Participants:</span>
                    {event.attendees.slice(0, 3).map((attendee) => {
                      return (
                        <Avatar key={attendee.id} className="h-6 w-6 border-2 border-background">
                          <AvatarImage src={attendee.image || undefined} alt={attendee.name || ''} />
                          <AvatarFallback className="text-[10px]">
                            {attendee.name
                              ?.split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                      );
                    })}
                    {event.attendees.length > 3 && (
                      <Badge variant="secondary" className="ml-1 h-6 rounded-full px-2">
                        +{event.attendees.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Link href={`/dashboard/events/${event.id}`} className={buttonVariants({ size: 'sm', className: 'w-full' })}>
                    View Event
                  </Link>
                </CardFooter>
              </Card>
            ))}

            <Card className="border-dashed flex flex-col items-center justify-center p-8">
              <CalendarDays className="h-8 w-8 text-muted-foreground mb-4" />
              <h3 className="font-medium text-center mb-2">Create a new event</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">Plan birthdays, holidays, and special occasions</p>
              <Button asChild>
                <Link href="/dashboard/events/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Event
                </Link>
              </Button>
            </Card>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
