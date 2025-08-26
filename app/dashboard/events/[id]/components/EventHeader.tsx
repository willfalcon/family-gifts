import { JSONContent } from '@tiptap/react';
import { CalendarDays, Clock, Edit, MapPin } from 'lucide-react';
import Link from 'next/link';

import { EventFromGetEvent } from '@/lib/queries/events';
import { formatDate, formatTime } from '@/lib/utils';

import Favorite from '@/app/dashboard/components/Favorite';
import MessageDialog from '@/components/Messages/MessageDialog';
import { ShareButton } from '@/components/ShareButton';
import Title from '@/components/Title';
import { buttonVariants } from '@/components/ui/button';
import Viewer from '@/components/ui/rich-text/viewer';
import { GetUser } from '@/lib/queries/user';
import EventDropdown from './EventDropdown';

type Props = {
  event: EventFromGetEvent;
  isManager: boolean;
  me: GetUser;
};

export default function EventHeader({ event, isManager, me }: Props) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Title>{event.name}</Title>
            <Favorite id={event.id} type="event" />
          </div>
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
                <span>{formatTime(event.time)}</span>
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
          <MessageDialog user={me.id} eventId={event.id} />
          <ShareButton />

          {isManager && (
            <Link href={`/dashboard/events/${event.id}/edit`} className={buttonVariants({ size: 'sm' })}>
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
