import { Gift } from 'lucide-react';
import Link from 'next/link';

import { EventFromGetFamily } from '@/lib/queries/families';
import { formatDate } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function EventCard({ event }: { event: EventFromGetFamily }) {
  return (
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
        {event.date && <CardDescription>{formatDate(event.date)}</CardDescription>}
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
  );
}
