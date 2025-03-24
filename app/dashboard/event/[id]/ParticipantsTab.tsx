import { TabsContent } from '@/components/ui/tabs';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EventFromGetEvent } from '@/lib/queries/events';

type Props = {
  event: EventFromGetEvent;
};

export default function ParticipantsTab({ event }: Props) {
  return (
    <TabsContent value="participants" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Participants</CardTitle>
          <CardDescription>People invited to this event</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {event.attendees.map((attendee) => (
              <div key={attendee.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={attendee.image || undefined} alt={attendee.name || ''} />
                    <AvatarFallback>
                      {attendee.name
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{attendee.name}</p>
                    <p className="text-sm text-muted-foreground">{attendee.email}</p>
                  </div>
                </div>
                {/* <Badge variant={member.attending === 'yes' ? 'default' : member.attending === 'maybe' ? 'outline' : 'secondary'}>
                  {member.attending === 'yes' ? 'Attending' : member.attending === 'maybe' ? 'Maybe' : 'Not Attending'}
                </Badge> */}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
