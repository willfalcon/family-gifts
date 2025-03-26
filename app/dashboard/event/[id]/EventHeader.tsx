import { ArrowLeft, CalendarDays, Clock, Edit, Gift, MapPin, MoreHorizontal, Share2, Users } from 'lucide-react';

import Viewer from '@/components/ui/rich-text/viewer';
import { JSONContent } from '@tiptap/react';
import { format } from 'date-fns';
import { Button, buttonVariants } from '@/components/ui/button';
import EditEvent from './EditEvent';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Title from '@/components/Title';
import { EventFromGetEvent } from '@/lib/queries/events';
import Link from 'next/link';

type Props = {
  event: EventFromGetEvent;
  isManager: boolean;
};

export default function EventHeader({ event, isManager }: Props) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Title>{event.name}</Title>
          {event.info && <Viewer className="text-muted-foreground mt-1" content={event.info as JSONContent} immediatelyRender={false} />}

          <div className="flex flex-wrap gap-4 mt-4">
            {event.date && (
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>{format(event.date, 'MMMM d, yyyy')}</span>
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
            <Link href={`/dashboard/event/${event.id}/edit`} className={buttonVariants()}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Event
            </Link>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Add to Calendar</DropdownMenuItem>
              <DropdownMenuItem>Send Reminder</DropdownMenuItem>
              {isManager && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">Cancel Event</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
