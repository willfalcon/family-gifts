'use server';

import { getMembers as getMembersQuery } from '@/prisma/queries';
import { AssignmentsType } from './Manager';
import { auth } from '@/auth';
import { Prisma } from '@prisma/client';
import { prisma } from '@/prisma';
import { revalidatePath } from 'next/cache';

export async function getMembers(id: string) {
  const res = await getMembersQuery(id);
  return res;
}

export async function createAssignments(assignments: AssignmentsType[], eventId: string) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this!',
      assignments: null,
    };
  }
  const familyId = assignments.reduce((prev: string, curr: AssignmentsType): string => {
    if (prev === 'Error') {
      return 'Error';
    }
    if (prev === 'Error' || (prev && curr[0].familyId !== prev)) {
      return 'Error';
    }
    return curr[0].familyId;
  }, '');

  if (familyId === 'Error') {
    return {
      success: false,
      message: 'Something weird going on (not all family members are associated with the same family)',
      assignments: null,
    };
  }

  const input: Prisma.AssignmentCreateManyInput[] = assignments.map(([giver, recipient]) => ({
    eventId,
    giverId: giver.id,
    receiverId: recipient.id,
  }));
  try {
    const newAssignments = await prisma.assignment.createMany({
      data: input,
    });
    if (newAssignments) {
      revalidatePath(`/dashboard/event/${eventId}`);
      return {
        success: true,
        message: '',
        assignments: newAssignments,
      };
    } else {
      return {
        success: false,
        message: `Couldn't create assignments.`,
        assignments: null,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
      assignments: null,
    };
  }
}
