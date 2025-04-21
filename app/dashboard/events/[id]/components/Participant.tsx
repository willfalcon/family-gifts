'use client';
import { Invite, Prisma } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

import { EventFromGetEvent } from '@/lib/queries/events';
import { cn } from '@/lib/utils';
import { addManager, type GetParticipant, getParticipant, removeInvite, removeManager, removeParticipant } from '../actions';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type Participant = Prisma.UserGetPayload<{
  include: {
    managedEvents: true;
  };
}>;

type Props = {
  participant?: Participant;
  invite: Invite;
  isManager: boolean;
  attendeeIsManager?: boolean;
  event: EventFromGetEvent;
};

export default function Participant({ participant: initialParticipant, invite: initialInvite, isManager, event }: Props) {
  const query = useQuery({
    queryKey: ['participant', initialInvite.id],
    queryFn: async (): Promise<GetParticipant> => {
      const participant = await getParticipant(initialInvite.id);
      return participant as unknown as GetParticipant;
    },
    initialData: {
      ...initialInvite,
      user: initialParticipant || null,
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (action: 'addManager' | 'removeManager' | 'removeParticipant' | 'removeInvite') => {
      switch (action) {
        case 'addManager':
          await addManager(event.id, initialParticipant?.id);
          break;
        case 'removeManager':
          await removeManager(event.id, initialParticipant?.id);
          break;
        case 'removeParticipant':
          await removeParticipant(event.id, initialInvite.id);
          break;
        case 'removeInvite':
          await removeInvite(event.id, initialInvite.id);
          break;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participant', initialInvite.id] });
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
  });

  if (!query.isLoading && !query.data) {
    return null;
  }

  const { user: participant, ...invite } = query.data!;

  const attendeeIsManager = participant?.managedEvents.some((e) => e.id === event.id);
  if (participant) {
    return (
      <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md gap-3">
        <div className="flex items-center gap-3 flex-1">
          <Avatar>
            <AvatarImage src={participant.image || undefined} alt={participant.name || ''} />
            <AvatarFallback>
              {participant.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{participant.name}</p>
            <p className="text-sm text-muted-foreground">{participant.email}</p>
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
        <Badge
          variant={attendeeIsManager ? 'default' : 'outline'}
          className={cn((query.isFetching || mutation.isPending) && 'animate-pulse opacity-50')}
        >
          {attendeeIsManager ? 'Manager' : 'Participant'}
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
              {attendeeIsManager && <DropdownMenuItem onClick={() => mutation.mutate('removeManager')}>Remove as Manager</DropdownMenuItem>}
              {!attendeeIsManager && <DropdownMenuItem onClick={() => mutation.mutate('addManager')}>Make Manager</DropdownMenuItem>}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => mutation.mutate('removeParticipant')}>Remove</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    );
  }
  if (invite) {
    return (
      <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
        <div className="flex items-center gap-3 flex-1">
          <Avatar>
            <AvatarFallback>{invite.email?.[0] ?? ''}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{invite.email ?? ''}</p>
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
              <DropdownMenuItem className="text-destructive" onClick={() => mutation.mutate('removeInvite')}>
                Remove from Event
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    );
  }
}
