import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { Channel, Event, Prisma } from '@prisma/client';
import { cache } from 'react';
import { getActiveFamilyId } from '../rscUtils';
import { addMinutes } from 'date-fns';

export const getChannels = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      channels: null,
    };
  }
  try {
    const channels = await prisma.channel.findMany({
      where: {
        OR: [
          {
            groupMembers: {
              some: {
                user: {
                  id: session.user.id,
                },
              },
            },
          },
          {
            event: {
              family: {
                members: {
                  some: {
                    user: {
                      id: session.user.id,
                    },
                  },
                },
              },
            },
          },
          {
            family: {
              members: {
                some: {
                  user: {
                    id: session.user.id,
                  },
                },
              },
            },
          },
        ],
      },
      include: {
        event: true,
        messages: true,
        family: true,
        groupMembers: true,
      },
    });
    if (!channels) {
      return {
        success: false,
        message: 'No channels found',
        channels: null,
      };
    }
    return {
      success: true,
      message: '',
      channels,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
      channels: null,
    };
  }
});

export type GetChannelReturnType = Prisma.ChannelGetPayload<{
  include: {
    messages: {
      include: {
        sender: {
          include: {
            user: true;
            managing: true;
          };
        };
        readBy: true;
      };
    };
  };
}>;

export const getChannel = cache(async (id: Channel['id']) => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      channel: undefined,
    };
  }
  try {
    // TODO explicitely type this return so I can trace the conflicts down
    const channel = await prisma.channel.findUnique({
      where: {
        id,
      },
      include: {
        messages: {
          include: {
            sender: {
              include: {
                user: true,
                managing: true,
              },
            },
            readBy: true,
          },
        },
      },
    });

    if (!channel) {
      return {
        success: false,
        message: 'No channels found',
        channel: undefined,
      };
    }
    return {
      success: true,
      message: '',
      channel,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
      channel: undefined,
    };
  }
});

export const getNewMessages = cache(async (id: Channel['id']) => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      messages: null,
    };
  }
  try {
    const activeFamilyId = await getActiveFamilyId();

    const messages = await prisma.message.findMany({
      where: {
        channel: {
          id,
          family: {
            id: activeFamilyId,
          },
        },
        OR: [
          {
            createdAt: {
              gt: addMinutes(new Date(), -5),
            },
          },
          {
            updatedAt: {
              gt: addMinutes(new Date(), -5),
            },
          },
        ],
      },
      include: {
        sender: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!messages) {
      return {
        success: false,
        message: 'No messages found',
        messages: null,
      };
    }
    return {
      success: true,
      message: '',
      messages,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
      messages: null,
    };
  }
});

export const getChannelWithType = cache(async (id: Channel['id']) => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      channel: null,
    };
  }
  try {
    const channel = await prisma.channel.findUnique({
      where: {
        id,
      },
      include: {
        family: true,
        event: {
          include: {
            family: true,
          },
        },
        groupMembers: true,
      },
    });

    if (!channel) {
      return {
        success: false,
        message: 'No channels found',
        channel: null,
      };
    }
    return {
      success: true,
      message: '',
      channel,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
      channel: null,
    };
  }
});

export const getFamilyChannel = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      channel: null,
    };
  }
  try {
    const activeFamily = await getActiveFamilyId();
    const channel = await prisma.channel.findFirst({
      where: {
        family: {
          id: activeFamily,
        },
      },
      include: {
        messages: {
          include: {
            sender: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!channel) {
      return {
        success: false,
        message: 'No channels found',
        channel: null,
      };
    }
    return {
      success: true,
      message: '',
      channel,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
      channel: null,
    };
  }
});

export const getEventChannel = cache(async (id: Event['id']) => {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      channel: null,
    };
  }
  try {
    const channel = await prisma.channel.findFirst({
      where: {
        event: {
          id,
          family: {
            members: {
              some: {
                user: {
                  id: session.user.id,
                },
              },
            },
          },
        },
      },
      include: {
        messages: {
          include: {
            sender: {
              include: {
                user: true,
                managing: true,
              },
            },
            readBy: true,
          },
        },
      },
    });

    if (!channel) {
      return {
        success: false,
        message: 'No channels found',
        channel: null,
      };
    }
    return {
      success: true,
      message: '',
      channel,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
      channel: null,
    };
  }
});
