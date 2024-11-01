'use client';
import Title from '@/components/Title';
import Participants from './Participants';
import { useQuery } from '@tanstack/react-query';
import { createAssignments, getMembers } from './actions';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import Exclusions from './Exclusions';
import { FamilyMember } from '@prisma/client';
import Assignments from './Assignments';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AssignmentWithRefs } from '@/prisma/types';

type Props = {
  familyId: string;
  eventId: string;
  assignments?: AssignmentWithRefs[];
};

export interface Exclusion {
  giver: FamilyMember;
  excluded: FamilyMember;
}

export type AssignmentsType = FamilyMember[];

export default function Manager({ familyId, eventId, assignments }: Props) {
  const { data, isPending, error } = useQuery({ queryKey: ['members', familyId], queryFn: () => getMembers(familyId) });

  const defaultParticipating =
    assignments?.reduce((acc: FamilyMember[], cur: AssignmentWithRefs): FamilyMember[] => {
      const toAdd = [];
      if (!acc.find((a) => a.id === cur.giver.id)) {
        toAdd.push(cur.giver);
      }
      if (!acc.find((a) => a.id === cur.receiver.id)) {
        toAdd.push(cur.receiver);
      }
      return [...acc, ...toAdd];
    }, []) || [];
  const [participating, setParticipants] = useState<FamilyMember[]>(defaultParticipating);
  const [exclusions, setExclusions] = useState<Exclusion[]>([]);
  const defaultAssignments = assignments?.map((assignment) => [assignment.giver, assignment.receiver]) || [];
  const [assignmentsList, setAssignments] = useState<AssignmentsType[]>(defaultAssignments);
  if (isPending) {
    return <Skeleton />;
  }

  if (error) {
    return (
      <div>
        <p>Something went wrong.</p>
        <pre>
          <code>{error.message}</code>
        </pre>
      </div>
    );
  }

  const { members, success, message } = data;

  async function saveAssignments() {
    const { success, message, assignments } = await createAssignments(assignmentsList, eventId);
    if (success && assignments) {
      toast.success('Assignments saved.');
    } else {
      toast.error(message);
    }
  }

  return (
    <div>
      <Title>Secret Santa Manager</Title>
      <p className="text-sm text-muted-foreground">Select participants and set exclusions for Secret Santa</p>
      {success ? (
        <>
          {members?.length ? (
            <>
              <Participants members={members} participating={participating} setParticipants={setParticipants} />
              <Exclusions participating={participating} exclusions={exclusions} setExclusions={setExclusions} />
              <Assignments assignmentsList={assignmentsList} setAssignments={setAssignments} participating={participating} exclusions={exclusions} />
              <Button onClick={saveAssignments}>Save Assignments</Button>
            </>
          ) : (
            <p>Add members to set up secret santa.</p>
          )}
        </>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
}
