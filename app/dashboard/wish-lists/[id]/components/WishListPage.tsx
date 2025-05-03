import { User } from 'next-auth';

import { GetList } from '@/lib/queries/items';

import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WishListHeader from './Header';
import WishListItem from './Item';

type Props = {
  list: GetList;
  me?: User;
};

export default function WishListPage({ list, me }: Props) {
  // Get all unique categories from items
  const categories = Array.from(new Set(list.items.flatMap((item) => item.categories || []))).sort();

  const isOwner = list.userId === me?.id;

  // Group items by category
  const itemsByCategory = categories.reduce<Record<string, typeof list.items>>((acc, category) => {
    acc[category as string] = list.items.filter((item) => item.categories && item.categories.includes(category));
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8">
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Wish Lists', href: '/dashboard/wish-lists' },
          { name: list.name, href: `/dashboard/wish-lists/${list.id}` },
        ]}
      />

      <WishListHeader list={list} categories={categories} isOwner={isOwner} me={me} />

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="all">All Items</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {list.items.map((item) => (
            <WishListItem key={item.id} item={item} isOwner={isOwner} categories={categories} />
          ))}
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {itemsByCategory[category]?.map((item) => <WishListItem key={item.id} item={item} isOwner={isOwner} categories={categories} />)}
          </TabsContent>
        ))}
      </Tabs>
      {/* <WishList categories={categories} {...list} /> */}
    </div>
  );
}
