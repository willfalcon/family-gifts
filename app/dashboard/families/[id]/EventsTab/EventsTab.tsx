'use client';

import { CalendarDays, Plus, Search } from 'lucide-react';
import Link from 'next/link';

import { EventFromGetFamily, GetFamily, MemberFromGetFamily } from '@/lib/queries/families';

import { useBreadcrumbs } from '@/components/HeaderBreadcrumbs';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TabsContent } from '@/components/ui/tabs';
import EventCard from './EventCard';

type Props = {
  members: MemberFromGetFamily[];
  family: GetFamily;
};

export default function EventsTab({ members, family }: Props) {
  const relatedEvents = members.reduce<EventFromGetFamily[]>((events, member) => {
    member.events.forEach((event) => {
      if (!events.find((e) => e.id === event.id)) {
        events.push(event);
      }
    });
    return events;
  }, []);

  const setBreadcrumbs = useBreadcrumbs();
  setBreadcrumbs([
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Families', href: '/dashboard/families' },
    { name: family.name, href: `/dashboard/families/${family.id}` },
    { name: 'Events', href: `/dashboard/families/${family.id}?tab=events` },
  ]);

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
              <EventCard key={event.id} event={event} />
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
