import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { getListInclude } from './items';

export async function getFavorites() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('You must be logged in to get favorites');
  }
  return await prisma.favorite.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      family: {
        include: {
          managers: true,
          invites: true,
          members: {
            include: {
              managing: true,
              _count: {
                select: {
                  lists: true,
                },
              },
            },
            take: 3,
          },
          creator: true,
          _count: {
            select: {
              members: true,
            },
          },
        },
      },
      event: true,
      list: {
        include: getListInclude,
      },
    },
  });
}
