'use server';

import { getActiveMember, getMembers as getMembersQuery } from '@/lib/queries/family-members';
import { auth } from '@/auth';
import { EventResponse, FamilyMember, Prisma } from '@prisma/client';
import { prisma } from '@/prisma';
import { revalidatePath } from 'next/cache';
import { AssignmentsType } from './SecretSanta/secretSantaStore';
import { getActiveFamilyId } from '@/lib/rscUtils';
import { Resend } from 'resend';
import secretSantaNotification from '@/emails/secretSanta';

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
    if (prev === 'Error' || (prev && curr.giver.familyId !== prev)) {
      return 'Error';
    }
    return curr.giver.familyId;
  }, '');

  if (familyId === 'Error') {
    return {
      success: false,
      message: 'Something weird going on (not all family members are associated with the same family)',
      assignments: null,
    };
  }

  const input: Prisma.AssignmentCreateManyInput[] = assignments.map(({ giver, receiver }) => ({
    eventId,
    giverId: giver.id,
    receiverId: receiver.id,
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

export async function isFamilyManager() {
  const me = await getActiveMember();
  if (!me) {
    return false;
  }

  const activeFamilyId = await getActiveFamilyId();

  const activeFamily = await prisma.family.findUnique({ where: { id: activeFamilyId }, include: { managers: true } });
  if (!activeFamily) {
    return false;
  }
  return activeFamily.managers.some((manager) => manager.id === me.id);
}

export async function saveAssignments(eventId: string, assignments: AssignmentsType[]) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this!',
      assignments: null,
    };
  }

  // must be family manager

  if (!(await isFamilyManager())) {
    return {
      success: false,
      message: 'You must be a family manager to do this!',
      assignments: null,
    };
  }

  try {
    await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        assignments: {
          deleteMany: {},
        },
      },
    });
    const event = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        assignments: {
          createMany: {
            data: assignments.map(({ giver, receiver }) => ({
              giverId: giver.id,
              receiverId: receiver.id,
            })),
          },
        },
      },
      include: {
        assignments: true,
      },
    });

    if (event) {
      revalidatePath(`/dashboard/event/${eventId}`);
      return {
        success: true,
        message: '',
        assignments: event.assignments,
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

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendSecretSantaEmail(giver: FamilyMember, recipient: FamilyMember, eventId: string) {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        family: true,
      },
    });
    if (!event) {
      return {
        success: false,
        error: null,
        data: null,
        message: "Couldn't find event.",
      };
    }
    const { data, error } = await resend.emails.send({
      from: `Invite <${process.env.FROM_EMAIL_ADDRESS}>`,
      to: [giver.email],
      subject: 'Your Secret Santa Assignment',
      react: secretSantaNotification({ recipient, event }),
    });
    if (error) {
      console.error('sendSecretSantaEmail:', error);
      return {
        success: false,
        error,
        data: null,
        message: 'Error',
      };
    }
    return {
      success: true,
      error: null,
      data,
      message: '',
    };
  } catch (error) {
    console.error('sendSecretSantaEmail:', error);
    return {
      success: false,
      error: null,
      data: null,
      message: 'Something went wrong sending email.',
    };
  }
}

export async function getEventAttendance(inviteId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }
  const invite = await prisma.invite.findUnique({
    where: {
      id: inviteId,
      userId: session.user.id,
    },
  });
  return invite?.eventResponse;
}
export async function updateEventAttendance(inviteId: string, response: EventResponse) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }
  const invite = await prisma.invite.update({
    where: {
      id: inviteId,
      userId: session.user.id,
    },
    data: { eventResponse: response },
  });
  if (!invite) {
    throw new Error('Invite not found.');
  }
  return invite;
}
