import { JSONContent } from '@tiptap/react';
import { format } from 'date-fns';
import { CalendarDays, Clock, MapPin } from 'lucide-react';

import { EventFromGetEvent } from '@/lib/queries/events';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Viewer from '@/components/ui/rich-text/viewer';
import { TabsContent } from '@/components/ui/tabs';

type Props = {
  event: EventFromGetEvent;
};
export default function DetailsTab({ event }: Props) {
  return (
    <TabsContent value="details" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {event.info && (
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <Viewer content={event.info as JSONContent} immediatelyRender={false} />
            </div>
          )}
          {(event.date || event.time) && (
            <div>
              <h3 className="font-medium mb-2">Date and Time</h3>
              {event.date && (
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>{format(event.date, 'MMMM d, yyyy')}</span>
                </div>
              )}
              {event.time && (
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{format(event.time, 'h:mm aaa')}</span>
                </div>
              )}
            </div>
          )}
          {event.location && (
            <div>
              <h3 className="font-medium mb-2">Location</h3>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
