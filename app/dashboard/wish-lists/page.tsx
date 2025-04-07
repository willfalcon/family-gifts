import { auth } from '@/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Plus, Gift, Search } from 'lucide-react';

import { getUserLists } from '@/lib/queries/lists';

import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Title, { SubTitle } from '@/components/Title';
import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import WishListCard from '@/components/WishListCard';

export default async function WishLists() {
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
      <div className="flex items-center mb-6">
        <div className="relative w-full max-w-sm">
          {/* TODO: Add search functionality */}
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search wish lists..." className="w-full pl-8" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lists.map((list) => (
          <WishListCard key={list.id} list={list} />
        ))}
        <Card className="border-dashed flex flex-col items-center justify-center p-8">
          <Gift className="h-8 w-8 text-muted-foreground mb-4" />
          <h3 className="font-medium text-center mb-2">Create a new wish list</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">Add items you'd like to receive as gifts</p>
          <Button asChild>
            <Link href="/dashboard/wish-lists/new">
              <Plus className="mr-2 h-4 w-4" />
              New List
            </Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
