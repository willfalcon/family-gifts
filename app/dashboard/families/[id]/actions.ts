'use server';

import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { Family, FamilyVisibility, Invite, User } from '@prisma/client';
import { randomBytes } from 'crypto';
import { addDays } from 'date-fns';
import { revalidatePath } from 'next/cache';

import { sendNotification } from '@/lib/notifications';
import { canManageFamily } from '@/lib/permissions';
import { getFamilyInclude, getFamily as getFamilyQuery } from '@/lib/queries/families';
import { FamilySchemaType } from '../familySchema';
import { sendInviteEmail } from '../new/actions';
import { InvitesSchema, InvitesSchemaType } from './inviteSchema';

export async function sendInviteNotification(invite: Invite) {
  const res = await sendNotification({
    email: invite.email,
    title: 'You have been invited to a family',
    message: 'You have been invited to a family',
    type: 'info',
    link: `/join?token=${invite.token}`,
  });
  console.log('sendInviteNotification res: ', res);
}

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
  await Promise.all(
    updatedInvites.map((invite) => {
      sendInviteEmail(invite, updated);
      sendInviteNotification(invite);
    }),
  );
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
  if (memberId === session?.user?.id) {
    throw new Error('You cannot remove yourself from the family');
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
  const updatedFamily = await prisma.family.update({
    where: { id: familyId },
    data: {
      members: {
        disconnect: {
          id: memberId,
        },
      },
    },
    include: getFamilyInclude,
  });
  return updatedFamily;
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

export async function promoteMember(familyId: Family['id'], memberId: User['id']) {
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
    throw new Error('You must be a manager to promote a member');
  }
  const updatedFamily = await prisma.family.update({
    where: { id: familyId },
    data: {
      managers: { connect: { id: memberId } },
    },
    include: getFamilyInclude,
  });
  return updatedFamily;
}

export async function demoteMember(familyId: Family['id'], memberId: User['id']) {
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
    throw new Error('You must be a manager to demote a member');
  }
  if (memberId === session?.user?.id) {
    throw new Error('You cannot demote yourself');
  }
  if (family.managers.length === 1) {
    throw new Error('You cannot demote the last manager from the family');
  }

  const updatedFamily = await prisma.family.update({
    where: { id: familyId },
    data: {
      managers: { disconnect: { id: memberId } },
    },
    include: getFamilyInclude,
  });
  return updatedFamily;
}

export type FamilyPrivacy = {
  visibility: FamilyVisibility;
  allowInvites: boolean;
  requireApproval: boolean;
};

export async function updateFamilyPrivacy(familyId: Family['id'], data: FamilyPrivacy) {
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
    throw new Error('You must be a manager to update the family privacy');
  }
  const updatedFamily = await prisma.family.update({
    where: { id: familyId },
    data: {
      visibility: data.visibility,
      allowInvites: data.allowInvites,
      requireApproval: data.requireApproval,
    },
    include: getFamilyInclude,
  });
  return updatedFamily;
}

export async function deleteFamily(familyId: Family['id']) {
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
    throw new Error('You must be a manager to delete the family');
  }
  const deletedFamily = await prisma.family.delete({
    where: { id: familyId },
  });
  return deletedFamily;
}

export async function transferFamily(familyId: Family['id'], newOwnerId: User['id']) {
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
  if (family.creatorId !== session?.user?.id) {
    throw new Error('You must be the owner to transfer the family');
  }
  const updatedFamily = await prisma.family.update({
    where: { id: familyId },
    data: {
      creatorId: newOwnerId,
      managers: {
        connect: {
          id: newOwnerId,
        },
      },
    },
    include: getFamilyInclude,
  });
  return updatedFamily;
}

export async function removeSelf(familyId: Family['id']) {
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

  if (family.creatorId === session?.user?.id) {
    throw new Error('You cannot leave your own family. Transfer ownership first or delete the family entirely.');
  }

  if (family.managers.some((member) => member.id === session?.user?.id) && family.managers.length === 1) {
    throw new Error('You are the only manager of this family. Make another manager, transfer ownership or delete the family entirely.');
  }

  const updatedFamily = await prisma.family.update({
    where: { id: familyId },
    data: {
      members: {
        disconnect: {
          id: session?.user?.id,
        },
      },
      managers: {
        disconnect: {
          id: session?.user?.id,
        },
      },
    },
    include: getFamilyInclude,
  });
  return updatedFamily;
}

export async function cancelInvite(inviteId: Invite['id']) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  if (!session?.user?.id) {
    throw new Error('Session error. Try logging out and in again.');
  }

  const invite = await prisma.invite.findUnique({
    where: { id: inviteId },
    include: {
      family: {
        include: {
          managers: true,
        },
      },
    },
  });

  if (!invite || !invite.familyId) {
    throw new Error('Invite not found');
  }
  if (!(await canManageFamily(invite.familyId, session?.user?.id))) {
    throw new Error(`You don't have permission to cancel this invite.`);
  }
  const deletedInvite = await prisma.invite.delete({
    where: { id: inviteId },
  });
  revalidatePath(`/dashboard/families/${deletedInvite.familyId}`);
  return deletedInvite;
}
