'use client';

import { FamilyMemberWithManaging, FamilyMemberWithUser, FamilyWithManagers } from "@/prisma/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AddMember from './AddMember';

import DeleteFamily from './DeleteFamily';
import { useState, useTransition } from "react";
import MembersList from "./MembersList";

type Props = {
  family: FamilyWithManagers;
  me: FamilyMemberWithManaging;
  members: FamilyMemberWithUser[];
  message: string;
  success: boolean;
}
export default function FamilyCards({family, me, members: initialMembers, success, message}: Props) {

  const isManager = family?.managers.some((manager) => manager.id === me.id) || false;
  const [members, setMembers] = useState(initialMembers);
  const [isPending, startTransition] = useTransition();
  return (
    <>
      {isManager && (
        <Card>
          <CardHeader>
            <CardTitle>{family.name}</CardTitle>
            <CardDescription>Add, remove, or update family members and their permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <AddMember family={family} startTransition={startTransition} setMembers={setMembers} />
          </CardContent>
        </Card>
      )}
      
      <MembersList family={family} members={members} isManager={isManager} isPending={isPending} setMembers={setMembers} startTransition={startTransition} success={success} message={message} />

      <Card>
        <CardHeader>
          <CardTitle>Family Settings</CardTitle>
        </CardHeader>
        <CardContent>{isManager && <DeleteFamily family={family} />}</CardContent>
      </Card>
    </>
  )
}