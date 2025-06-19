import { Gift, GiftIcon, Plus } from 'lucide-react';
import Link from 'next/link';

import { dashboardGetUserLists } from '@/lib/queries/lists';

import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import WishListCard from '@/components/WishListCard';

export default async function WishListSection() {
  const wishlists = await dashboardGetUserLists();
  if (!wishlists.lists.length) {
    return <NewListCard />;
  }

  return (
    <section className="mb-10 @container">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Wish Lists</h2>
        <Link href="/dashboard/wish-lists" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
          <GiftIcon className="mr-2 h-4 w-4" />
          Manage Wish Lists
        </Link>
      </div>
      <div className="grid @lg:grid-cols-2 @3xl:grid-cols-3 gap-4">
        {wishlists.lists.map((list) => (
          <WishListCard key={list.id} list={list} />
        ))}
        <NewListCard />
      </div>
    </section>
  );
}

function NewListCard() {
  return (
    <Card className="border-dashed flex flex-col items-center justify-center p-8">
      <Gift className="h-8 w-8 text-muted-foreground mb-4" />
      <h3 className="font-medium text-center mb-2">Create a new Wish List</h3>
      <p className="text-sm text-muted-foreground text-center mb-4">Add items you'd like to receive as gifts</p>

      <Link href="/dashboard/wish-lists/new" className={buttonVariants()}>
        <Plus className="mr-2 h-4 w-4" />
        New Wish List
      </Link>
    </Card>
  );
}
