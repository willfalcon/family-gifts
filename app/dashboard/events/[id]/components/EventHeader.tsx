import { ArrowLeft, CalendarDays, Clock, Edit, Gift, MapPin, MoreHorizontal, Share2, Users } from 'lucide-react';

import Viewer from '@/components/ui/rich-text/viewer';
import { JSONContent } from '@tiptap/react';
import { format } from 'date-fns';
import { Button, buttonVariants } from '@/components/ui/button';

import EventDropdown from './EventDropdown';
import Title from '@/components/Title';
import { EventFromGetEvent } from '@/lib/queries/events';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

type Props = {
  event: EventFromGetEvent;
  isManager: boolean;
};

export default function EventHeader({ event, isManager }: Props) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <Title>{event.name}</Title>
          {event.info && <Viewer className="text-muted-foreground mt-1" content={event.info as JSONContent} immediatelyRender={false} />}

          <div className="flex flex-wrap gap-4 mt-4">
            {event.date && (
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(event.date)}</span>
              </div>
            )}
            {event.time && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{format(event.time, 'h:mm aaa')}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>

          {isManager && (
            <Link href={`/dashboard/events/${event.id}/edit`} className={buttonVariants()}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Event
            </Link>
          )}
          <EventDropdown event={event} isManager={isManager} />
        </div>
      </div>
    </div>
  );
}
