import { prisma } from '@/prisma';
import { notFound } from 'next/navigation';

import { getListInclude } from '@/lib/queries/items';

import WishListPage from '@/app/dashboard/wish-lists/[id]/components/WishListPage';
import { cache } from 'react';

export const metadata = {
  title: 'List',
  description: 'View a list',
  robots: {
    index: false,
  },
};
const getList = cache(async (token: string) => {
  const list = await prisma.list.findFirst({
    where: {
      shareLink: token,
    },
    include: getListInclude,
  });
  return list;
});

type Props = { params: { token: string } };

export default async function ListLink({ params }: Props) {
  const { token } = params;
  const list = await getList(token);
  if (!list || list?.visibilityType !== 'link') {
    notFound();
  }
  return <WishListPage list={list} />;
}

export async function generateMetadata({ params }: Props) {
  const { token } = params;
  const list = await getList(token);
  return {
    title: `${list?.name} | Family Gifts`,
    description: `View ${list?.name} on Family Gifts`,
  };
}
