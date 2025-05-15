import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { EventFromGetEvent } from '@/lib/queries/events';
import { GetFamilies } from '@/lib/queries/families';
import useAttendeesStore from './store';

type Props = {
  families: GetFamilies[];
  attendees: EventFromGetEvent['attendees'];
};

export default function MorePeople({ families, attendees }: Props) {
  const { family: familyId, selectedParticipants, toggleParticipant } = useAttendeesStore();
  const family = families?.find((f) => f.id === familyId);

  const moreSelectedParticipants = attendees.filter((member) => !family?.members.map((m) => m.id).includes(member.id));

  return (
    moreSelectedParticipants.length > 0 && (
      <>
        <h3 className="text-lg font-medium">More People</h3>
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {moreSelectedParticipants.map((member) => (
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
        </div>
      </>
    )
  );
}
