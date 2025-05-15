import { useMutation, useQuery } from '@tanstack/react-query';
import { Loader2, Mail, Plus, X } from 'lucide-react';
import { FormEvent, useEffect } from 'react';
import { toast } from 'sonner';

import { updateEventAttendees } from '@/app/dashboard/events/actions';
import { EventAttendeesSchemaType } from '@/app/dashboard/events/eventSchema';
import { EventFromGetEvent } from '@/lib/queries/events';
import useAttendeesStore from './store';

import { TabsSkeleton } from '@/app/dashboard/events/components/Attendees';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { getFamilies } from '../actions';
import MemberSearch from './MemberSearch';
import MemberSelect from './MemberSelect';
import MorePeople from './MorePeople';
import PrimaryFamily from './PrimaryFamily';
export default function AttendeesForm({ event }: { event: EventFromGetEvent }) {
  const { selectedParticipants, externalInvites, addExternalInvite, removeExternalInvite, newInviteEmail, setNewInviteEmail, family, initialize } =
    useAttendeesStore();

  useEffect(() => {
    initialize(event);
  }, [event]);

  const { data: families, isLoading: familiesLoading } = useQuery({
    queryKey: ['families'],
    queryFn: async () => {
      const families = await getFamilies();
      return families;
    },
  });

  const { mutate, isPending } = useMutation({
    async mutationFn(data: EventAttendeesSchemaType) {
      return await updateEventAttendees(event.id, data);
    },
    onSuccess(data) {
      console.log(data);
      toast.success(`${data.name} updated!`);
    },
    onError(error) {
      console.error(error);
      toast.error('Failed to update event attendees');
    },
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await mutate({
      attendees: selectedParticipants,
      externalInvites: externalInvites,
      familyId: family,
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Attendees</CardTitle>
          <CardDescription>Select people to invite to this event</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {familiesLoading ? (
            <TabsSkeleton />
          ) : families ? (
            <>
              <PrimaryFamily families={families} />
              <MemberSelect families={families} />
              <MorePeople families={families} attendees={event.attendees} />
              <MemberSearch />
              <Separator className="my-6" />
              <div>
                <h3 className="text-lg font-medium mb-4">External Invites</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Invite people who don't have an account or aren't in your family. They'll receive an email invitation to join the event.
                </p>
              </div>
              {externalInvites.length > 0 && (
                <div className="mb-4 space-y-2">
                  {externalInvites.map((invite) => (
                    <div key={invite} className="flex items-center justify-between p-3 bg-muted rounded-md">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">
                            <Mail className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm text-muted-foreground">{invite}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeExternalInvite(invite)} className="h-8 w-8 p-0">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="inviteEmail">Email Address</Label>
                    <Input
                      id="inviteEmail"
                      type="email"
                      value={newInviteEmail}
                      onChange={(e) => setNewInviteEmail(e.target.value)}
                      placeholder="friend@example.com"
                    />
                  </div>
                </div>
                <Button onClick={addExternalInvite} variant="outline" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Invite
                </Button>
              </div>
            </>
          ) : (
            <ErrorMessage title="Couldn't get families" />
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
