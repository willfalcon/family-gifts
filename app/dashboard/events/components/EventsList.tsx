'use client';

import { useQuery } from '@tanstack/react-query';
import { Calendar, CalendarDays, ChevronRight, Gift, Plus, Search, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { GetEvents } from '@/lib/queries/events';
import { formatDate } from '@/lib/utils';
import { getPastEvents } from '../actions';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Props = {
  upcomingEvents: GetEvents;
};

export default function EventsList({ upcomingEvents }: Props) {
  const query = useQuery({
    queryKey: ['events'],
    queryFn: () => getPastEvents(),
  });

  const [searchTerm, setSearchTerm] = useState('');
  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search members..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <List events={upcomingEvents} searchTerm={searchTerm} />
        </TabsContent>
        <TabsContent value="past">{query.data && <List events={query.data} searchTerm={searchTerm} />}</TabsContent>
      </Tabs>
    </>
  );
}

function List({ events, searchTerm }: { events: GetEvents; searchTerm: string }) {
  const filteredEvents = events.filter((event) => event.name.toLowerCase().includes(searchTerm.toLowerCase()));
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {!!filteredEvents.length &&
        filteredEvents.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle>{event.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {!!event.assignments.length && (
                <Badge className="mb-2" variant="outline">
                  Secret Santa
                </Badge>
              )}
              {event.date && (
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  {formatDate(event.date)}
                </div>
              )}
              <p className="mt-2 text-sm text-muted-foreground">{event._count.visibleLists} wish lists associated</p>
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
