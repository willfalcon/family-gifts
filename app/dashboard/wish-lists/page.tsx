import { auth } from '@/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getUserLists } from '@/lib/queries/lists';

import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import Title, { SubTitle } from '@/components/Title';
import { buttonVariants } from '@/components/ui/button';
import WishLists from './WishLists';

export default async function WishListsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const lists = await getUserLists();

  return (
    <div className="container mx-auto px-4 py-8">
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Wish Lists', href: '/dashboard/wish-lists' },
        ]}
      />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <Title>Wish Lists</Title>
          <SubTitle>Manage your wish lists and view lists shared with you.</SubTitle>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/wish-lists/new" className={buttonVariants({ variant: 'outline' })}>
            Create List
          </Link>
        </div>
      </div>
      <WishLists lists={lists} />
    </div>
  );
}
