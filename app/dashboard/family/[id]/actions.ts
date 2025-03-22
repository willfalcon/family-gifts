'use server';

import { Family } from '@prisma/client';
import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { randomBytes } from 'crypto';
import { addDays } from 'date-fns';
import { sendInviteEmail } from '../../families/new/actions';
import { InvitesSchema, InvitesSchemaType } from './inviteSchema';

export async function inviteMembers(familyId: Family['id'], data: InvitesSchemaType) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }
  const strippedInvites = data.invites?.filter((invite) => invite.value) || [];
  const validatedData = InvitesSchema.parse({ ...data, invites: strippedInvites });

  try {
    const existingInvites = await prisma.invite.findMany({
      where: {
        familyId,
        email: {
          in: validatedData.invites?.map((invite) => invite.value),
        },
      },
    });

    const uniqueInvites = validatedData.invites?.filter((invite) => !existingInvites.some((i) => i.email === invite.value));

    if (!uniqueInvites) {
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
  } catch (err) {
    throw new Error('Something went wrong.');
  }
}
