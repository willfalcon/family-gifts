import { ArrowLeft, ArrowRight } from 'lucide-react';

import { EventFromGetEvent } from '@/lib/queries/events';
import { useSecretSantaStore } from '../store';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useTabs } from '@/components/ui/tabs';

type Props = {
  event: EventFromGetEvent;
};

export default function Participants({ event }: Props) {
  const { participants, addParticipant, removeParticipant, setParticipants } = useSecretSantaStore();
  const { setValue } = useTabs();
  function addAll() {
    setParticipants(event.attendees);
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Participants</CardTitle>
        <CardDescription>Choose who will participate in the Secret Santa exchange</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button variant="outline" onClick={() => addAll()}>
            Select All
          </Button>
          {participants.length > 0 && (
            <div className="p-4 bg-muted rounded-md mb-4">
              <div className="font-medium mb-2">Selected Participants ({participants.length})</div>
              <div className="flex flex-wrap gap-2">
                {participants.map((participant) => {
                  return (
                    participant && (
                      <Badge key={participant.id} variant="secondary" className="flex items-center gap-1 pl-1">
                        <Avatar className="h-5 w-5 mr-1">
                          <AvatarImage src={participant.image || undefined} alt={participant.name || undefined} />
                          <AvatarFallback className="text-[10px]">
                            {participant.name
                              ?.split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        {participant.name}
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1" onClick={() => removeParticipant(participant)}>
                          ×
                        </Button>
                      </Badge>
                    )
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {event.attendees.map((attendee) => (
              <div key={attendee.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`participant-${attendee.id}`}
                  checked={participants.some((p) => p.id === attendee.id)}
                  onCheckedChange={(checked) => (checked ? addParticipant(attendee) : removeParticipant(attendee))}
                />
                <div className="flex items-center gap-3 flex-1">
                  <Avatar>
                    <AvatarImage src={attendee.image || undefined} alt={attendee.name || undefined} />
                    <AvatarFallback>
                      {attendee.name
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor={`participant-${attendee.id}`}>{attendee.name}</Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="outline" onClick={() => setValue('setup')}>
          <ArrowLeft className="w-4 h-4" />
          Setup
        </Button>
        <Button onClick={() => setValue('exclusions')}>
          Next <ArrowRight className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
