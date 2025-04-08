'use server';

import { Family, User } from '@prisma/client';
import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { randomBytes } from 'crypto';
import { addDays } from 'date-fns';
import { sendInviteEmail } from '../../families/new/actions';
import { InvitesSchema, InvitesSchemaType } from './inviteSchema';
import { getFamily as getFamilyQuery } from '@/lib/queries/families';
import { revalidatePath } from 'next/cache';
import { FamilySchemaType } from '../familySchema';

export async function inviteMembers(familyId: Family['id'], data: InvitesSchemaType) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }
  const strippedInvites = data.invites?.filter((invite) => invite.value) || [];
  const validatedData = InvitesSchema.parse({ ...data, invites: strippedInvites });

  const existingInvites = await prisma.invite.findMany({
    where: {
      familyId,
      email: {
        in: validatedData.invites?.map((invite) => invite.value),
      },
    },
  });

  const uniqueInvites = validatedData.invites?.filter((invite) => !existingInvites.some((i) => i.email === invite.value));

  if (!uniqueInvites?.length) {
    throw new Error('All these people are already invited. You can resend their invites instead.');
  }

  const updated = await prisma.family.update({
    where: {
      id: familyId,
    },
    data: {
      invites: {
        create:
          uniqueInvites?.map((invite) => {
            const token = randomBytes(20).toString('hex');
            const tokenExpiry = addDays(new Date(), 30);
            return {
              email: invite.value,
              token,
              tokenExpiry,
            };
          }) || [],
      },
    },
    include: {
      invites: {
        where: {
          email: {
            in: uniqueInvites?.map((invite) => invite.value) || [],
          },
        },
      },
    },
  });

  if (!updated) {
    throw new Error(`Couldn't update invites for some reason`);
  }

  const updatedInvites = updated?.invites.filter((newInvite) => uniqueInvites.find((i) => i.value === newInvite.email));
  await Promise.all(updatedInvites.map((invite) => sendInviteEmail(invite, updated)));
  revalidatePath(`/dashboard/family/${familyId}`);
  return existingInvites;
}

export async function getFamily(familyId: Family['id']) {
  return await getFamilyQuery(familyId);
}

export async function removeMember(familyId: Family['id'], memberId: User['id']) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }
  const family = await prisma.family.findUnique({
    where: { id: familyId },
    include: {
      managers: true,
    },
  });
  if (!family) {
    throw new Error('Family not found');
  }
  if (!family.managers.some((manager) => manager.id === session?.user?.id)) {
    throw new Error('You are not a manager of this family');
  }
  await prisma.family.update({
    where: { id: familyId },
    data: {
      members: {
        disconnect: {
          id: memberId,
        },
      },
    },
  });
}

export async function updateFamily(familyId: Family['id'], data: FamilySchemaType) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }
  const family = await prisma.family.findUnique({
    where: { id: familyId },
    include: {
      managers: true,
    },
  });
  if (!family) {
    throw new Error('Family not found');
  }
  if (!family.managers.some((manager) => manager.id === session?.user?.id)) {
    throw new Error('You must be a manager to edit this family');
  }
  const updatedFamily = await prisma.family.update({
    where: { id: familyId },
    data: {
      name: data.name,
      description: JSON.parse(JSON.stringify(data.description || {})),
    },
  });
  revalidatePath(`/dashboard/families/${familyId}`);
  return updatedFamily;
}
