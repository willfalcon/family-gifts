'use server';

import { auth } from '@/auth';
import { getFamilies as getFamiliesQuery } from '@/lib/queries/families';
import { getUserForSearch as getUserForSearchQuery } from '@/lib/queries/user';
import { prisma } from '@/prisma';
import { User } from '@prisma/client';
import { cache } from 'react';

export async function getFamilies() {
  return await getFamiliesQuery();
}

const getUserForSearch = cache(async (id: User['id']) => {
  return await getUserForSearchQuery(id);
});

export const searchMembers = cache(async (query: string) => {
  if (!query) return [];
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be logged in to search for members.');
  }
  const user = await getUserForSearch(session.user.id);
  const members = await prisma.user.findMany({
    where: {
      AND: [
        {
          OR: [{ name: { contains: query, mode: 'insensitive' } }, { email: { contains: query, mode: 'insensitive' } }],
        },
        {
          OR: [
            {
              activityVisibility: {
                has: 'public',
              },
            },
            {
              OR: [
                {
                  families: {
                    some: {
                      id: {
                        in: user.families.map((f) => f.id),
                      },
                    },
                  },
                },
                {
                  events: {
                    some: {
                      attendees: {
                        some: {
                          id: {
                            in: user.events.map((e) => e.id),
                          },
                        },
                      },
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    take: 10,
  });
  return members;
});
