import DeleteFamilyMember from '@/components/family/DeleteFamilyMember';
import ResendInvite from '@/components/family/ResendInvite';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import { FamilyMemberWithUser } from '@/prisma/types';
import { FamilyMember } from '@prisma/client';
import { Check, Mail, MoreHorizontal, ShieldCheck, Trash2 } from 'lucide-react';
import PromoteMember from './PromoteMember';
import { Dispatch, SetStateAction, TransitionStartFunction, useState } from 'react';
import DemoteMember from './DemoteMember';

type Props = {
  member: FamilyMemberWithUser;
  managers: FamilyMember[];
  startTransition: TransitionStartFunction;
  setMembers: Dispatch<SetStateAction<FamilyMemberWithUser[]>>;
  isManager: boolean
}
export default function MemberListItem({member, managers, startTransition, setMembers, isManager}: Props) {
  const [removeOpen, setRemoveOpen] = useState(false);
  const [promoteOpen, setPromoteOpen] = useState(false);
  const [demoteOpen, setDemoteOpen] = useState(false);
  const [resendOpen, setResendOpen] = useState(false);
  const memberIsManager = managers.find(manager => manager.id === member.id);
  return (
    <TableRow key={member.id}>
      <TableCell>{member.name}</TableCell>
      <TableCell>{member.email}</TableCell>
      <TableCell>{member.joined && <Check />}</TableCell>
      <TableCell>{memberIsManager && <Check />}</TableCell>
      {isManager && (
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => setResendOpen(true)}>
                <Mail className="h-4 w-4 mr-2" /> Resend Invite
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRemoveOpen(true)}>
                <Trash2 className="h-4 w-4 mr-2" /> Remove Member
              </DropdownMenuItem>
              {memberIsManager ? (
                <DropdownMenuItem onClick={() => setDemoteOpen(true)}>
                  <ShieldCheck className="h-4 w-4 mr-2" /> Demote Member
                </DropdownMenuItem>
              ) : ( 
                <DropdownMenuItem onClick={() => setPromoteOpen(true)}> 
                  <ShieldCheck className="h-4 w-4 mr-2" /> Promote Member
                </DropdownMenuItem>
              )}
                
            </DropdownMenuContent>
          </DropdownMenu>

          <ResendInvite member={member} open={resendOpen} setOpen={setResendOpen} />
          <DeleteFamilyMember member={member} startTransition={startTransition} setMembers={setMembers} open={removeOpen} setOpen={setRemoveOpen} />
          <PromoteMember member={member} startTransition={startTransition} setMembers={setMembers} open={promoteOpen} setOpen={setRemoveOpen} />
          <DemoteMember member={member} startTransition={startTransition} setMembers={setMembers} open={demoteOpen} setOpen={setDemoteOpen} />
        </TableCell>
      )}

    </TableRow>
  )
}