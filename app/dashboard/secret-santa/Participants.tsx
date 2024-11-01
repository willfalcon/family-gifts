import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FamilyMember } from '@prisma/client';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  members: FamilyMember[];
  participating: FamilyMember[];
  setParticipants: Dispatch<SetStateAction<FamilyMember[]>>;
};

export default function Participants({ members, participating, setParticipants }: Props) {
  console.log({ members, participating });
  const toggleParticipant = (member: FamilyMember) => {
    setParticipants((p) => {
      const isIncluded = p.find((includedMember) => includedMember.id === member.id);
      return isIncluded ? p.filter((removedMember) => removedMember.id !== member.id) : [...p, member];
    });
  };

  return (
    <>
      <h3 className="text-lg font-semibold mt-6">Select Participants</h3>
      <p className="mb-2 text-sm text-muted-foreground">Who should be included?</p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {members.map((member) => (
          <div key={member.id} className="flex items-center space-x-2">
            <Checkbox
              id={`participant-${member.id}`}
              checked={!!participating.find((p) => p.id === member.id)}
              onCheckedChange={() => toggleParticipant(member)}
            />
            <Label htmlFor={`participant-${member.id}`}>{member.name}</Label>
          </div>
        ))}
      </div>
    </>
  );
}
