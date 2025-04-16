import { prisma } from '@/prisma';
import { notFound } from 'next/navigation';

import { getListInclude } from '@/lib/queries/items';

import WishListPage from '@/app/dashboard/wish-lists/[id]/components/WishListPage';

export default async function ListLink({ params }: { params: { token: string } }) {
  const { token } = params;
  const list = await prisma.list.findFirst({
    where: {
      shareLink: token,
    },
    include: getListInclude,
  });
  if (!list || list?.visibilityType !== 'link') {
    notFound();
  }
  return <WishListPage list={list} />;
}
