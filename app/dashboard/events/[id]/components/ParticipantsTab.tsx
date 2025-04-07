import { TabsContent } from '@/components/ui/tabs';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { EventFromGetEvent } from '@/lib/queries/events';

import { auth } from '@/auth';

import Participant from './Participant';

type Props = {
  event: EventFromGetEvent;
};

export default async function ParticipantsTab({ event }: Props) {
  const session = await auth();
  const isManager = event.managers.some((manager) => manager.id === session?.user?.id);
  return (
    <TabsContent value="participants" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Participants</CardTitle>
          <CardDescription>People invited to this event</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {event.attendees.map((attendee) => {
              // attendee is User with managedEvents

              const invite = event.invites.find((invite) => invite.email === attendee.email);
              if (!invite) {
                return null;
              }
              return <Participant key={attendee.id} event={event} participant={attendee} invite={invite} isManager={isManager} />;
            })}
            {event.invites
              .filter((invite) => !invite.userId)
              .map((invite) => {
                return <Participant key={invite.id} event={event} invite={invite} isManager={isManager} />;
              })}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
