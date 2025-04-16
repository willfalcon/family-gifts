import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import { MemberFromGetFamily } from '@/lib/queries/families';
import { Family } from '@prisma/client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PromoteDemote from '../../../shared-components/PromoteDemote';
import RemoveMember from '../../../shared-components/RemoveMember';

type Props = {
  member: MemberFromGetFamily;
  isManager: boolean;
  familyId: Family['id'];
  isSelf: boolean;
};

export default function MemberListItem({ member, isManager, familyId, isSelf }: Props) {
  const [removeOpen, setRemoveOpen] = useState(false);
  const [changingRole, setChangingRole] = useState(false);

  return (
    <tr key={member.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
      <td className="p-4 align-middle">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={member.image || undefined} alt={member.name || undefined} />
            <AvatarFallback>
              {member.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{member.name}</span>
        </div>
      </td>
      <td className="p-4 align-middle">{member.email}</td>
      <td className="p-4 align-middle">
        <Badge variant={changingRole ? 'outline' : isManager ? 'default' : 'secondary'}>
          {changingRole ? <Loader2 className="animate-spin" /> : isManager ? 'Manager' : 'Member'}
        </Badge>
      </td>
      <td className="p-4 align-middle">
        <div className="flex items-center justify-end gap-2">
          <PromoteDemote isManager={isManager} familyId={familyId} setChangingRole={setChangingRole} memberId={member.id} />

          {!isSelf && (
            <RemoveMember
              familyId={familyId}
              member={member}
              open={removeOpen}
              setOpen={setRemoveOpen}
              triggerButton={
                <Button variant="destructive" size="sm">
                  Remove
                </Button>
              }
            />
          )}
        </div>
      </td>
    </tr>
  );
}
