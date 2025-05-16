import { auth } from '@/auth';
import { notFound, redirect } from 'next/navigation';

import { getList } from '@/lib/queries/items';

import WishListPage from './components/WishListPage';

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const list = await getList(id);
  return {
    title: `${list?.name}`,
    description: `Manage ${list?.name} on Family Gifts`,
    robots: {
      index: false,
    },
  };
}

export default async function page({ params }: PageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }
  const { id } = await params;
  const list = await getList(id);

  if (!list) {
    notFound();
  }

  return <WishListPage list={list} me={session.user} />;
}
