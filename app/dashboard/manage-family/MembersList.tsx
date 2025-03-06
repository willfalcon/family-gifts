import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Family } from '@prisma/client';


import ResendInvite from '@/components/family/ResendInvite';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, MoreHorizontal } from 'lucide-react';


import MembersTableSkeleton from '@/app/dashboard/manage-family/MembersTableSkeleton';

import DeleteFamilyMember from '@/components/family/DeleteFamilyMember';
import { FamilyMemberWithUser, FamilyWithManagers } from '@/prisma/types';
import { Dispatch, SetStateAction, TransitionStartFunction } from 'react';

import { Button } from '@/components/ui/button';
import PromoteMember from './PromoteMember';
import MemberListItem from './MemberListItem';

type MembersListProps = { 
  family: FamilyWithManagers; 
  isManager: boolean; 
  success: boolean; 
  isPending: boolean;
  members: FamilyMemberWithUser[];
  startTransition: TransitionStartFunction;
  setMembers: Dispatch<SetStateAction<FamilyMemberWithUser[]>>;
  message: string;
};

export default function MembersList({ family, isManager = false, success, isPending, members, startTransition, setMembers, message }: MembersListProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Family Members</CardTitle>
      </CardHeader>
      <CardContent>
        {success ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Manager</TableHead>
                {isManager && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                <MembersTableSkeleton items={members.length}/>
              ) : 
                members.map((member) => (
                  <MemberListItem key={member.id} member={member} managers={family?.managers} startTransition={startTransition} setMembers={setMembers} isManager={isManager} />
                  )
              )}
            </TableBody>
          </Table>
        ) : (
          <p>{message}</p>
        )}
      </CardContent>
    </Card>
  );
}
