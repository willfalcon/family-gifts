import { Card } from '@/components/ui/card';
import { Gift, Plus } from 'lucide-react';
import { dashboardGetUserLists } from '@/lib/queries/lists';
import { Users } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export default async function WishListSection() {
  const wishlists = await dashboardGetUserLists();
  if (!wishlists.lists.length) {
    return (
      <Card className="border-dashed flex flex-col items-center justify-center p-8">
        <Gift className="h-8 w-8 text-muted-foreground mb-4" />
        <h3 className="font-medium text-center mb-2">Create a new Wish List</h3>
        <p className="text-sm text-muted-foreground text-center mb-4">Add items you'd like to receive as gifts</p>

        <Link href="/dashboard/families/new" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          New Wish List
        </Link>
      </Card>
    );
  }
}
