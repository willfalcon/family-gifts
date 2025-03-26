import { TabsContent } from '@/components/ui/tabs';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EventFromGetEvent } from '@/lib/queries/events';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Invite } from '@prisma/client';
import { User } from '@prisma/client';
import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';

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
              const invite = event.invites.find((invite) => invite.email === attendee.email);
              const attendeeIsManager = event.managers.some((manager) => manager.id === attendee.id);
              return (
                <Participant key={attendee.id} attendee={attendee} invite={invite} isManager={isManager} attendeeIsManager={attendeeIsManager} />
              );
            })}
            {event.invites
              .filter((invite) => !invite.userId)
              .map((invite) => {
                return <Participant key={invite.id} invite={invite} isManager={isManager} />;
              })}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

function Participant({
  attendee,
  invite,
  isManager,
  attendeeIsManager,
}: {
  attendee?: User;
  invite?: Invite;
  isManager: boolean;
  attendeeIsManager?: boolean;
}) {
  if (attendee) {
    return (
      <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
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
        <Badge
          className={cn(
            'rounded-full',
            invite?.eventResponse === 'accepted'
              ? 'bg-green-600'
              : invite?.eventResponse === 'maybe'
                ? 'bg-yellow-600'
                : invite?.eventResponse === 'declined'
                  ? 'bg-red-600'
                  : 'bg-gray-600',
          )}
        >
          {invite?.eventResponse === 'accepted'
            ? 'Attending'
            : invite?.eventResponse === 'maybe'
              ? 'Maybe'
              : invite?.eventResponse === 'declined'
                ? 'Declined'
                : 'Pending'}
        </Badge>
        {isManager && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {attendeeIsManager && <DropdownMenuItem>Remove as Manager</DropdownMenuItem>}
              {!attendeeIsManager && <DropdownMenuItem>Make Manager</DropdownMenuItem>}
              <DropdownMenuSeparator />
              <DropdownMenuItem>Remove</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    );
  }
  if (invite) {
    <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>{invite.email[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{invite.email}</p>
        </div>
      </div>
      <Badge className={cn('rounded-full bg-gray-600')}>Pending</Badge>
      {isManager && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* <DropdownMenuItem asChild>
              <Link href={`/dashboard/family-members/${.id}`}>View Profile</Link>
            </DropdownMenuItem> */}

            {/* <DropdownMenuSeparator /> */}
            {/* TODO: Implement */}
            <DropdownMenuItem className="text-destructive">Remove from Event</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>;
  }
}
