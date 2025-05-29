'use server';

import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { Family, FamilyVisibility, Invite, User } from '@prisma/client';

import { addDays } from 'date-fns';
import { revalidatePath } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { sendNotification } from '@/lib/notifications';
import { canManageFamily } from '@/lib/permissions';
import { getFamilyInclude, getFamily as getFamilyQuery } from '@/lib/queries/families';
import { generateRandomHex } from '@/lib/rscUtils';
import { ConvexHttpClient } from 'convex/browser';
import { FamilySchemaType } from '../familySchema';
import { sendInviteEmail } from '../new/actions';
import { InvitesSchema, InvitesSchemaType } from './inviteSchema';

const getAuthUser = async () => {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }
  if (!session?.user?.id) {
    throw new Error('Session error. Try logging out and in again.');
  }
  return session.user;
};

const getAuthUserId = async () => {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }
  if (!session?.user?.id) {
    throw new Error('Session error. Try logging out and in again.');
  }
  return session.user.id;
};

export async function sendInviteNotification(invite: Invite) {
  if (!invite.email) {
    throw new Error('Invite has no email');
  }
  const res = await sendNotification({
    email: invite.email,
    title: 'You have been invited to a family',
    message: 'You have been invited to a family',
    type: 'info',
    link: `/join?token=${invite.token}`,
  });
  return res;
}

export async function inviteMembers(familyId: Family['id'], data: InvitesSchemaType) {
  await getAuthUserId();
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
            const token = generateRandomHex(20);
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
  const userId = await getAuthUserId();
  if (memberId === userId) {
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
  if (!family.managers.some((manager) => manager.id === userId)) {
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
    include: getFamilyInclude(familyId),
  });
  return updatedFamily;
}

export async function updateFamily(familyId: Family['id'], data: FamilySchemaType) {
  const userId = await getAuthUserId();
  const family = await prisma.family.findUnique({
    where: { id: familyId },
    include: {
      managers: true,
    },
  });
  if (!family) {
    throw new Error('Family not found');
  }
  if (!family.managers.some((manager) => manager.id === userId)) {
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
  const userId = await getAuthUserId();
  const family = await prisma.family.findUnique({
    where: { id: familyId },
    include: {
      managers: true,
    },
  });
  if (!family) {
    throw new Error('Family not found');
  }
  if (!family.managers.some((manager) => manager.id === userId)) {
    throw new Error('You must be a manager to promote a member');
  }
  const updatedFamily = await prisma.family.update({
    where: { id: familyId },
    data: {
      managers: { connect: { id: memberId } },
    },
    include: getFamilyInclude(familyId),
  });
  return updatedFamily;
}

export async function demoteMember(familyId: Family['id'], memberId: User['id']) {
  const userId = await getAuthUserId();

  const family = await prisma.family.findUnique({
    where: { id: familyId },
    include: {
      managers: true,
    },
  });
  if (!family) {
    throw new Error('Family not found');
  }
  if (!family.managers.some((manager) => manager.id === userId)) {
    throw new Error('You must be a manager to demote a member');
  }
  if (memberId === userId) {
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
    include: getFamilyInclude(familyId),
  });
  return updatedFamily;
}

export type FamilyPrivacy = {
  visibility?: FamilyVisibility;
  allowInvites?: boolean;
  requireApproval?: boolean;
};

export async function updateFamilyPrivacy(familyId: Family['id'], data: FamilyPrivacy) {
  const userId = await getAuthUserId();

  const family = await prisma.family.findUnique({
    where: { id: familyId },
    include: {
      managers: true,
    },
  });
  if (!family) {
    throw new Error('Family not found');
  }
  if (!family.managers.some((manager) => manager.id === userId)) {
    throw new Error('You must be a manager to update the family privacy');
  }
  const updatedFamily = await prisma.family.update({
    where: { id: familyId },
    data,
    include: getFamilyInclude(familyId),
  });
  return updatedFamily;
}

export async function deleteFamily(familyId: Family['id']) {
  const userId = await getAuthUserId();

  const family = await prisma.family.findUnique({
    where: { id: familyId },
    include: {
      managers: true,
    },
  });
  if (!family) {
    throw new Error('Family not found');
  }
  if (!family.managers.some((manager) => manager.id === userId)) {
    throw new Error('You must be a manager to delete the family');
  }
  const deletedFamily = await prisma.family.delete({
    where: { id: familyId },
  });
  return deletedFamily;
}

export async function transferFamily(familyId: Family['id'], newOwnerId: User['id']) {
  const userId = await getAuthUserId();

  const family = await prisma.family.findUnique({
    where: { id: familyId },
    include: {
      managers: true,
    },
  });
  if (!family) {
    throw new Error('Family not found');
  }
  if (family.creatorId !== userId) {
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
    include: getFamilyInclude(familyId),
  });
  return updatedFamily;
}

export async function removeSelf(familyId: Family['id']) {
  const userId = await getAuthUserId();

  const family = await prisma.family.findUnique({
    where: { id: familyId },
    include: {
      managers: true,
    },
  });

  if (!family) {
    throw new Error('Family not found');
  }

  if (family.creatorId === userId) {
    throw new Error('You cannot leave your own family. Transfer ownership first or delete the family entirely.');
  }

  if (family.managers.some((member) => member.id === userId) && family.managers.length === 1) {
    throw new Error('You are the only manager of this family. Make another manager, transfer ownership or delete the family entirely.');
  }

  const updatedFamily = await prisma.family.update({
    where: { id: familyId },
    data: {
      members: {
        disconnect: {
          id: userId,
        },
      },
      managers: {
        disconnect: {
          id: userId,
        },
      },
    },
    include: getFamilyInclude(familyId),
  });
  return updatedFamily;
}

export async function cancelInvite(inviteId: Invite['id']) {
  const userId = await getAuthUserId();

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
  if (!(await canManageFamily(invite.familyId, userId))) {
    throw new Error(`You don't have permission to cancel this invite.`);
  }
  const deletedInvite = await prisma.invite.delete({
    where: { id: inviteId },
  });
  revalidatePath(`/dashboard/families/${deletedInvite.familyId}`);
  return deletedInvite;
}

export async function generateInviteLink(familyId: Family['id']) {
  const userId = await getAuthUserId();

  if (!(await canManageFamily(familyId, userId))) {
    throw new Error("You don't have permission to generate an invite link for this family");
  }
  const token = generateRandomHex(7);
  const tokenExpiry = addDays(new Date(), 7);
  const updatedFamily = await prisma.family.update({
    where: { id: familyId },
    data: {
      inviteLinkToken: token,
      inviteLinkExpiry: tokenExpiry,
    },
    include: getFamilyInclude(familyId),
  });

  return updatedFamily;
}

export async function approveJoinRequest(inviteId: Invite['id']) {
  const userId = await getAuthUserId();

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

  if (!invite) {
    throw new Error('Invite not found');
  }
  if (!invite.userId) {
    throw new Error('Invite has no user');
  }
  if (!invite.familyId) {
    throw new Error('Invite has no family');
  }
  if (!invite.family?.managers.some((manager) => manager.id === userId)) {
    throw new Error('You must be a manager to approve a join request.');
  }

  const updatedFamily = await prisma.family.update({
    where: { id: invite.familyId },
    data: {
      members: { connect: { id: invite.userId } },
      invites: {
        delete: {
          id: inviteId,
        },
      },
    },
    include: getFamilyInclude(invite.familyId),
  });

  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  await client.mutation(api.channels.addChannelUser, {
    family: invite.familyId,
    user: invite.userId,
  });

  return updatedFamily;
}
export async function rejectJoinRequest(inviteId: Invite['id']) {
  const userId = await getAuthUserId();

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

  if (!invite) {
    throw new Error('Invite not found');
  }
  if (!invite.userId) {
    throw new Error('Invite has no user');
  }
  if (!invite.familyId) {
    throw new Error('Invite has no family');
  }
  if (!invite.family?.managers.some((manager) => manager.id === userId)) {
    throw new Error('You must be a manager to reject a join request.');
  }

  //delete invite
  const rejectedInvite = await prisma.invite.update({
    where: { id: inviteId },
    data: {
      approvalRejected: true,
    },
    include: {
      family: {
        include: getFamilyInclude(invite.familyId),
      },
    },
  });

  return rejectedInvite.family!;
}
