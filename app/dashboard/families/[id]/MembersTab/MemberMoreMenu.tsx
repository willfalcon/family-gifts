'use client';

import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { Dispatch, SetStateAction, useState } from 'react';

import { MemberFromGetFamily } from '@/lib/queries/families';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import PromoteDemote from '../../shared-components/PromoteDemote';
import RemoveMember from '../../shared-components/RemoveMember';

type Props = {
  member: MemberFromGetFamily;
  isManager: boolean;
  memberIsManager: boolean;
  familyId: string;
  setChangingRole: Dispatch<SetStateAction<boolean>>;
};
export default function MemberMoreMenu({ member, isManager, memberIsManager, familyId, setChangingRole }: Props) {
  const [removeOpen, setRemoveOpen] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link className="cursor-pointer" href={`/dashboard/family-members/${member.id}`}>
              View Profile
            </Link>
          </DropdownMenuItem>

          {isManager && (
            <>
              <DropdownMenuItem>
                <PromoteDemote isManager={memberIsManager} familyId={familyId} memberId={member.id} setChangingRole={setChangingRole} />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => setRemoveOpen(true)}>
                Remove Member
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <RemoveMember familyId={familyId} member={member} open={removeOpen} setOpen={setRemoveOpen} triggerButton={null} />
    </>
  );
}
