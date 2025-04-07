import { Form } from '@/components/ui/form';
import { EventAttendeesSchema, EventAttendeesSchemaType } from '@/app/dashboard/events/eventSchema';
import { EventFromGetEvent } from '@/lib/queries/events';
import { FamilyFromGetFamily } from '@/lib/queries/families';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FormEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Card, CardContent, CardTitle, CardHeader, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Mail, Plus, Search, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsSkeleton } from '@/app/dashboard/events/Attendees';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { updateEventAttendees } from '@/app/dashboard/events/actions';

export default function AttendeesForm({ event }: { event: EventFromGetEvent }) {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: families, isLoading: familiesLoading } = useQuery({
    queryKey: ['families'],
    queryFn: async (): Promise<FamilyFromGetFamily[]> => {
      const response = await fetch('/api/getFamilies');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

  const filteredFamilies = families
    ?.map((family) => ({
      ...family,
      members: family.members?.filter(
        (member) => member.name?.toLowerCase().includes(searchQuery.toLowerCase()) || member.email.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((family) => family.members.length > 0);

  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  useEffect(() => {
    setSelectedParticipants(
      event.attendees
        .filter((attendee) => families?.some((family) => family.members.some((member) => member.id === attendee.id)))
        .map((attendee) => attendee.id),
    );
  }, [event.attendees, families]);
  // Toggle participant selection
  const toggleParticipant = (participantId: string) => {
    if (selectedParticipants.includes(participantId)) {
      const updatedParticipants = selectedParticipants.filter((id) => id !== participantId);
      setSelectedParticipants(updatedParticipants);
    } else {
      const updatedParticipants = [...selectedParticipants, participantId];
      setSelectedParticipants(updatedParticipants);
    }
  };

  const selectAllInFamily = (familyId: string) => {
    const familyMembers = families?.find((f) => f.id === familyId)?.members || [];
    const familyMemberIds = familyMembers.map((member) => member.id);

    // Add all family members that aren't already selected
    const newSelectedParticipants = Array.from(new Set([...selectedParticipants, ...familyMemberIds]));
    setSelectedParticipants(newSelectedParticipants);
  };

  // State for external invites
  const [externalInvites, setExternalInvites] = useState<string[]>(
    event.invites?.filter((invite) => !invite.userId).map((invite) => invite.email) || [],
  );
  const [newInviteEmail, setNewInviteEmail] = useState('');

  const addExternalInvite = (e: FormEvent) => {
    e.preventDefault();
    // Check if email already exists in invites
    if (externalInvites.includes(newInviteEmail)) {
      return; // Email already exists
    }

    // Add new invite
    setExternalInvites([...externalInvites, newInviteEmail]);

    // Clear form
    setNewInviteEmail('');
  };

  // Remove external invite
  const removeExternalInvite = (email: string) => {
    setExternalInvites(externalInvites.filter((invite) => invite !== email));
  };

  const { mutate, isPending } = useMutation({
    async mutationFn(data: EventAttendeesSchemaType) {
      return await updateEventAttendees(event.id, data);
    },
    onSuccess(data) {
      console.log(data);
      toast.success(`${data.name} updated!`);
    },
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await mutate({
      attendees: selectedParticipants,
      externalInvites: externalInvites,
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
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search people..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          {familiesLoading ? (
            <TabsSkeleton />
          ) : families ? (
            <>
              <Tabs defaultValue={families[0].id} className="w-full">
                <TabsList className="w-full justify-start mb-4 overflow-x-auto">
                  {families.map((family) => (
                    <TabsTrigger key={family.id} value={family.id} className="flex-shrink-0">
                      {family.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {filteredFamilies?.map((family) => (
                  <TabsContent key={family.id} value={family.id} className="space-y-4">
                    {family.members.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">No matching members found</p>
                    ) : (
                      <div className="space-y-5">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">{family.members.length} members</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              selectAllInFamily(family.id);
                            }}
                            className="h-8"
                          >
                            Add All
                          </Button>
                        </div>
                        {family.members.map((member) => (
                          <div key={member.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`member-${member.id}`}
                              checked={selectedParticipants.includes(member.id)}
                              onCheckedChange={() => {
                                toggleParticipant(member.id);
                              }}
                            />
                            <div className="flex items-center gap-3 flex-1">
                              <Avatar>
                                <AvatarImage src={member.image || undefined} alt={member.name || ''} />
                                <AvatarFallback>
                                  {member.name
                                    ?.split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <Label htmlFor={`member-${member.id}`}>{member.name}</Label>
                                <p className="text-sm text-muted-foreground">{member.email}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
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
