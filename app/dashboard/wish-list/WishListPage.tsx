import { ListForWishListPage } from '@/prisma/types';
import Title from '@/components/Title';

import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import EditList from './EditList';

import Viewer from '@/components/ui/rich-text/viewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { JSONContent } from '@tiptap/react';
import { User } from 'next-auth';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import NewItem from './NewItem';
import ListItem from '@/app/dashboard/wish-list/ListItem';

type Props = {
  list: ListForWishListPage;
  me: User;
};

export default function WishListPage({ list, me }: Props) {
  // Get all unique categories from items
  const categories = Array.from(new Set(list.items.flatMap((item) => item.categories || []))).sort();

  const isOwner = list.userId === me.id;

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
          { name: list.name, href: `/dashboard/wish-list/${list.id}` },
        ]}
      />
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Title>{list.name}</Title>
            <Viewer content={list.description as JSONContent} className="text-muted-foreground" immediatelyRender={false} />
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm">By {list.user.name}</span>
              {!isOwner && <Button variant="secondary">Message Anonymously</Button>}
            </div>
          </div>
          <div className="flex gap-2">
            {!isOwner && (
              <>
                <Button variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </>
            )}
            {isOwner && (
              <>
                <EditList {...list} />
                <NewItem categories={categories} />
              </>
            )}
          </div>
        </div>
      </div>
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
            <ListItem key={item.id} item={item} list={list} categories={categories} all />
          ))}
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {itemsByCategory[category]?.map((item) => <ListItem key={item.id} item={item} list={list} categories={categories} />)}
          </TabsContent>
        ))}
      </Tabs>
      {/* <WishList categories={categories} {...list} /> */}
    </div>
  );
}
