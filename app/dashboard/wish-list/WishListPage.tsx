import { ListWithItems } from '@/prisma/types';
import Title from '@/components/Title';
import NewItem from './NewItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import EditList from './EditList';

import WishList from '@/components/Lists/WishList';

export default function WishListPage(list: ListWithItems) {
  const categories = list.items.reduce<string[]>((acc, cur) => {
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
          { name: 'Wish Lists', href: '/dashboard/wish-lists' },
          { name: list.name, href: `/dashboard/wish-list/${list.id}` },
        ]}
      />
      <div className="flex space-x-4">
        <Title>{list.name}</Title>
        <NewItem categories={categories} />
      </div>
      <WishList categories={categories} {...list} />
      <Card className="max-w-[1000px]">
        <CardHeader>
          <CardTitle>List Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <EditList {...list} />
        </CardContent>
      </Card>
    </div>
  );
}
