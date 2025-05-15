import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { GetFamilies } from '@/lib/queries/families';
import useAttendeesStore from './store';

type Props = {
  families: GetFamilies[];
};

export default function MemberSelect({ families }: Props) {
  const { family: familyId, selectedParticipants, toggleParticipant, setSelectedParticipants } = useAttendeesStore();

  const family = families?.find((f) => f.id === familyId);

  function selectAllInFamily(familyId: string) {
    const familyMembers = families?.find((f) => f.id === familyId)?.members || [];
    const familyMemberIds = familyMembers.map((member) => member.id);

    // Add all family members that aren't already selected
    const newSelectedParticipants = Array.from(new Set([...selectedParticipants, ...familyMemberIds]));
    setSelectedParticipants(newSelectedParticipants);
  }

  return (
    family && (
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="mb-4"
          onClick={(e) => {
            e.preventDefault();
            selectAllInFamily(familyId);
          }}
        >
          Check All in Family
        </Button>

        <div className="space-y-5">
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
      </div>
    )
  );
}
