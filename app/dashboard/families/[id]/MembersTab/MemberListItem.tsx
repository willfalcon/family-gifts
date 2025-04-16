import { AvatarImage } from '@radix-ui/react-avatar';
import { Gift, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { MemberFromGetFamily } from '@/lib/queries/families';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import MemberMoreMenu from './MemberMoreMenu';

type Props = {
  member: MemberFromGetFamily;
  memberIsManager: boolean;
  isManager: boolean;
  familyId: string;
};
export default function MemberListItem({ member, memberIsManager, isManager, familyId }: Props) {
  const [changingRole, setChangingRole] = useState(false);
  return (
    <tr key={member.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
      <td className="p-4 align-middle">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={member.image || undefined} alt={member.name || ''} />
            <AvatarFallback>
              {member.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <Link href={`/dashboard/family-members/${member.id}`} className="font-medium hover:underline">
            {member.name}
          </Link>
        </div>
      </td>
      <td className="p-4 align-middle">{member.email}</td>
      <td className="p-4 align-middle">
        <Badge variant={changingRole ? 'outline' : memberIsManager ? 'default' : 'secondary'}>
          {changingRole ? <Loader2 className="h-4 w-4 animate-spin" /> : memberIsManager ? 'Manager' : 'Member'}
        </Badge>
      </td>
      <td className="p-4 align-middle">{member._count.lists}</td>
      <td className="p-4 align-middle">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Mail className="h-4 w-4" />
            <span className="sr-only">Message</span>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/wish-lists?member=${member.id}`}>
              <Gift className="h-4 w-4" />
              <span className="sr-only">View Wish Lists</span>
            </Link>
          </Button>
          <MemberMoreMenu
            member={member}
            isManager={isManager}
            memberIsManager={memberIsManager}
            familyId={familyId}
            setChangingRole={setChangingRole}
          />
        </div>
      </td>
    </tr>
  );
}
