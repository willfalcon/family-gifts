'use client';

import { EventWithAssignments } from '@/prisma/types';
import { Family, FamilyMember } from '@prisma/client';
import Assignments from './Assignments';
import MemberAssignment from './MemberAssignment';
// import { Button } from '@/components/ui/button';
import Manager from './Manager';
import SecretSantaStoreProvider from './SecretSantaStoreProvider';

interface SecretSantaProps {
  isManager: boolean;
  family: Family;
  event: EventWithAssignments;
  assignment?: FamilyMember;
}

export default function SecretSanta({ isManager, family, event, assignment }: SecretSantaProps) {
  return (
    <SecretSantaStoreProvider event={event}>
      {assignment && <MemberAssignment assignment={assignment} />}
      {isManager && family && !!event.assignments.length && <Assignments eventId={event.id} isManager={isManager} />}
      {isManager && <Manager familyId={family.id} eventId={event.id} />}
    </SecretSantaStoreProvider>
  );
}
