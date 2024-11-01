import { auth } from '@/auth';
import Title from '@/components/Title';
import { redirect } from 'next/navigation';
import { getItems } from '@/prisma/queries';
import NewItem from './NewItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import ItemList from './ItemList';
import ListItem from './ListItem';
import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import { ItemWithMember } from '@/prisma/types';

type Result<T> = { success: true; message: string; items: T[] } | { success: false; message: string; items?: never };

export default async function page() {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const { items, success }: Result<ItemWithMember> = (await getItems()) as Result<ItemWithMember>;

  if (!success) {
    return <p>Couldn&apos;t get items.</p>;
  }

  const categories = items.reduce<string[]>((acc, cur) => {
    if (cur.category) {
      if (!acc.includes(cur.category)) {
        acc.push(cur.category);
      }
    }
    return acc;
  }, []);

  return (
    <div className="space-y-4 p-8 pt-6">
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Wish List', href: '/dashboard/wish-list' },
        ]}
      />
      <Title>Wish List</Title>
      <div className="space-y-4">
        {categories.map((category) => (
          <ItemList key={category} category={category}>
            {items
              .filter((item) => item.category === category)
              .map((item) => (
                <ListItem key={item.id} {...item} boughtBy={[]} categories={categories} />
              ))}
          </ItemList>
        ))}
        <ItemList category="Other">
          {items
            .filter((item) => !item.category)
            .map((item) => (
              <ListItem key={item.id} {...item} boughtBy={[]} categories={categories} />
            ))}
        </ItemList>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Add Item</CardTitle>
        </CardHeader>
        <CardContent>
          <NewItem categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
