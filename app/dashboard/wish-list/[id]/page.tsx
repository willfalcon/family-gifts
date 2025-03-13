import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getListById } from '@/lib/queries/items';

import WishListPage from '../WishListPage';

type PageProps = {
  params: { id: string };
};
export default async function page({ params }: PageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }
  const { list, success, message } = await getListById(params.id);

  if (!success || !list) {
    return <p>{message}</p>;
  }

  return <WishListPage list={list} me={session.user} />;
}
