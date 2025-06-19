import { prisma } from '@/prisma';
import { notFound } from 'next/navigation';

import { getListInclude } from '@/lib/queries/items';

import WishListPage from '@/app/dashboard/wish-lists/[id]/components/WishListPage';
import { cache } from 'react';

const getList = cache(async (token: string) => {
  const list = await prisma.list.findFirst({
    where: {
      shareLink: token,
    },
    include: getListInclude,
  });
  return list;
});

type Props = { params: Promise<{ token: string }> };

export default async function ListLink({ params }: Props) {
  const { token } = await params;
  const list = await getList(token);
  if (!list || !list.visibibleViaLink) {
    notFound();
  }
  return <WishListPage list={list} />;
}

export async function generateMetadata({ params }: Props) {
  const { token } = await params;
  const list = await getList(token);
  return {
    title: `${list?.name} | Family Gifts`,
    description: `View ${list?.name} on Family Gifts`,
  };
}
