import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { Prisma, User, Visibility } from '@prisma/client';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { getFamilies } from './families';
import { getSharedLists } from './lists';
import { getUser as getUserQuery } from './user';

export type Relation = {
  relationships: {
    type: 'family' | 'event' | 'list';
    name: string;
    id: string;
  }[];
  member: User;
};

const getUser = cache(async (id: User['id']) => {
  return await getUserQuery(id);
});

export const getRelatedMembers = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be logged in to do this');
  }

  const families = await getFamilies();
  const events = await getEventRelations(session.user.id);
  const lists = await getSharedLists();

  let members: Relation[] = [];

  families.forEach((family) => {
    family.members.forEach((member) => {
      if (member.id === session.user?.id) {
        return;
      }
      if (!members.some((m) => m.member.id === member.id)) {
        members.push({
          member,
          relationships: [
            {
              type: 'family',
              name: family.name,
              id: family.id,
            },
          ],
        });
      }
    });
  });
  events.forEach((event) => {
    event.attendees.forEach((attendee) => {
      if (attendee.id === session.user?.id) {
        return;
      }
      if (!members.some((m) => m.member.id === attendee.id)) {
        members.push({
          member: attendee,
          relationships: [
            {
              type: 'event',
              name: event.name,
              id: event.id,
            },
          ],
        });
      } else {
        members
          .find((m) => m.member.id === attendee.id)
          ?.relationships.push({
            type: 'event',
            name: event.name,
            id: event.id,
          });
      }
    });
  });
  lists.forEach((list) => {
    if (list.user.id === session.user?.id) {
      return;
    }
    if (!members.some((m) => m.member.id === list.user.id)) {
      members.push({
        member: list.user,
        relationships: [
          {
            type: 'list',
            name: list.name,
            id: list.id,
          },
        ],
      });
    } else {
      members
        .find((m) => m.member.id === list.user.id)
        ?.relationships.push({
          type: 'list',
          name: list.name,
          id: list.id,
        });
    }
  });

  return members;
});

export type GetRelatedMembers = Prisma.UserGetPayload<{}>;

const getEventRelations = cache(async (userId: string) => {
  //TODO: add privacy filter
  const events = await prisma.event.findMany({
    where: {
      attendees: {
        some: { id: userId },
      },
    },
    include: {
      attendees: true,
    },
  });

  return events;
});

export const getMember = cache(async (id: string) => {
  const member = await prisma.user.findUnique({
    where: { id },
    include: {
      families: {
        include: {
          members: true,
        },
      },
      events: {
        include: {
          attendees: true,
        },
      },
      lists: {
        include: {
          visibleToUsers: true,
        },
      },
    },
  });

  if (!member || member.profileVisibility.includes(Visibility.private)) {
    notFound();
  }

  if (member.profileVisibility.includes(Visibility.public)) {
    return member;
  }

  const session = await auth();
  if (!session?.user?.id) {
    notFound();
  }

  const me = await getUser(session.user.id);

  if (member.profileVisibility.includes(Visibility.family)) {
    if (member.families.some((f) => f.members.some((m) => m.id === me.id))) {
      return member;
    }
  }

  if (member.profileVisibility.includes(Visibility.events)) {
    if (member.events.some((e) => e.attendees.some((a) => a.id === me.id))) {
      return member;
    }
  }

  if (member.profileVisibility.includes(Visibility.lists)) {
    if (member.lists.some((l) => l.visibleToUsers.some((u) => u.id === me.id))) {
      return member;
    }
  }

  notFound();
});

export type GetMember = Prisma.UserGetPayload<{
  include: {
    families: {
      include: {
        members: true;
      };
    };
    events: {
      include: {
        attendees: true;
      };
    };
    lists: {
      include: {
        visibleToUsers: true;
      };
    };
  };
}>;

export const getMembers = cache(async (memberIds: string[]) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be logged in to do this');
  }
  const members = await prisma.user.findMany({
    where: {
      id: {
        in: memberIds,
      },
    },
  });
  return members;
});

export const getMemberByEmail = cache(async (email: string) => {
  const member = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return member;
});
