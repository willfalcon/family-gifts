'use server';

import { auth } from '@/auth';
import { api } from '@/convex/_generated/api';
import { prisma } from '@/prisma';
import { Family, Invite } from '@prisma/client';
import { ConvexHttpClient } from 'convex/browser';
import { randomBytes } from 'crypto';
import { addDays } from 'date-fns';
import { Resend } from 'resend';

import InviteEmailTemplate from '@/emails/invite';
import { FamilySchema, FamilySchemaType } from '../familySchema';

export async function createFamily(data: FamilySchemaType) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('You must be logged in to do this.');
  }

  const strippedInvites = data.members?.filter((member) => member.value) || [];
  const validatedData = FamilySchema.parse({ ...data, members: strippedInvites });

  console.log(session.user);
  try {
    const family = await prisma.family.create({
      data: {
        name: data.name,
        creator: {
          connect: {
            id: session.user.id,
          },
        },
        managers: {
          connect: {
            id: session.user.id,
          },
        },
        members: {
          connect: {
            id: session.user.id,
          },
        },
        invites: {
          create:
            validatedData.members?.map((invite) => {
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
        invites: true,
      },
    });

    if (family) {
      const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
      const channel = await client.mutation(api.channels.createChannel, {
        name: family.name,
        users: [session.user.id!],
        type: 'family',
        messages: [],
        family: family.id,
      });
      await prisma.family.update({
        where: {
          id: family.id,
        },
        data: {
          familyChannel: channel,
        },
      });
      await Promise.all(family.invites.map((invite) => sendInviteEmail(invite, family)));
      return family;
    } else {
      throw new Error(`Couldn't create family.`);
    }
  } catch (err) {
    throw new Error('Something went wrong.');
  }
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInviteEmail(invite: Invite, family: Family) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Invite <${process.env.FROM_EMAIL_ADDRESS}>`,
      to: [invite.email],
      subject: 'Join the family',
      react: InviteEmailTemplate(invite, family),
    });
    if (error) {
      console.error('sendInviteEmail:', error);
      throw new Error(`Couldn't send email.`);
    }
    return data;
  } catch (error) {
    console.error('sendInviteEmail:', error);
    throw new Error(`Something went wrong sending email.`);
  }
}
