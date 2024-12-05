'use server';

import { auth } from '@/auth';
import { getChannelWithType } from '@/lib/queries/chat';
import { getFamilyMember } from '@/lib/queries/family-members';
import { prisma } from '@/prisma';
import { ChannelWithType } from '@/prisma/types';
import { Channel, FamilyMember } from '@prisma/client';

function checkCanSendMessage(channel: ChannelWithType, member: FamilyMember) {
  const type = channel.type;
  const returnObj = {
    success: false,
    sent: null,
  };
  if (type === 'family' && channel.familyId !== member.familyId) {
    return {
      ...returnObj,
      message: 'You must be a member of the family to send messages.',
    };
  }

  if (type === 'event' && channel.event?.familyId !== member.familyId) {
    return {
      ...returnObj,
      message: 'You must be invited to the event to send messages.',
    };
  }

  if (type === 'individual' && channel.groupMembers.some((member) => member.id !== member.id)) {
    return {
      ...returnObj,
      message: 'You must be a member of the group to send messages.',
    };
  }
  return {
    success: true,
    sent: null,
    message: null,
  };
}
export async function postMessage(channel: Channel['id'], message: string) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      sent: null,
    };
  }

  try {
    const me = await getFamilyMember();
    if (!me.success || !me.member) {
      return {
        success: false,
        message: `Make sure you're logged in and in a family`,
        sent: null,
      };
    }

    const channelDetails = await getChannelWithType(channel);

    if (!channelDetails.success || !channelDetails.channel) {
      return {
        success: false,
        message: channelDetails.message,
        sent: null,
      };
    }

    const canSendMessage = checkCanSendMessage(channelDetails.channel, me.member);
    if (!canSendMessage.success) {
      return canSendMessage;
    }

    const sent = await prisma.message.create({
      data: {
        channel: {
          connect: {
            id: channel,
          },
        },
        sender: {
          connect: {
            id: me.member.id,
          },
        },
        text: message,
      },
      include: {
        sender: true,
      },
    });

    if (!sent) {
      return {
        success: false,
        message: 'Error sending message',
        sent: null,
      };
    }

    return {
      success: true,
      message: 'Message sent',
      sent,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong',
      sent: null,
    };
  }
}
