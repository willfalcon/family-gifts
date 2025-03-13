import { auth } from '@/auth';
import Title from '@/components/Title';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { getUserLists } from '@/lib/queries/lists';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import CreateList from './CreateList';
import SetBreadcrumbs from '@/components/SetBreadcrumbs';

export default async function WishLists() {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const { lists, success, message } = await getUserLists();

  if (!success || !lists) {
    return <p>{message}</p>;
  }

  return (
    <div className="space-y-4 p-8 pt-6">
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Wish Lists', href: '/dashboard/wish-lists' },
        ]}
      />
      <div className="flex justify-between">
        <Title>Wish Lists</Title>
        <CreateList />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lists.map((list) => (
          <Card key={list.id}>
            <CardHeader>
              <CardTitle>{list.name}</CardTitle>
              <CardDescription>{list._count.items} items</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {list.visibleTo.length ? `Shared with: ${list.visibleTo.map((family) => family.name).join()}` : 'Not shared'}
              </p>
            </CardContent>
            <CardFooter className="justify-between">
              <Link href={`/dashboard/wish-list/${list.id}`} className={buttonVariants({ variant: 'outline' })}>
                View
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
