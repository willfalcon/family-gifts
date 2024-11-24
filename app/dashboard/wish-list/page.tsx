import { auth } from '@/auth';
import { redirect } from 'next/navigation';

import { getDefaultList } from '@/lib/queries/items';
import WishListPage from './WishListPage';

// type Result<T> = { success: true; message: string; items: T[] } | { success: false; message: string; items?: never };

export default async function page() {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  // const { items, success }: Result<ItemWithMember> = (await getItems()) as Result<ItemWithMember>;

  const { list, success, message } = await getDefaultList();

  if (!success || !list) {
    return <p>{message}</p>;
  }

  return <WishListPage {...list} />;
}
