import { auth } from '@/auth';
import { notFound, redirect } from 'next/navigation';

import { getList } from '@/lib/queries/items';

import WishListPage from './components/WishListPage';

type PageProps = {
  params: { id: string };
};
export default async function page({ params }: PageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }
  const list = await getList(params.id);

  if (!list) {
    notFound();
  }

  return <WishListPage list={list} me={session.user} />;
}
