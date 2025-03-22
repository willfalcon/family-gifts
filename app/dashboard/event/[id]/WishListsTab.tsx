import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { getLists } from '@/lib/queries/lists';
import { Prisma } from '@prisma/client';
import Link from 'next/link';

type Props = {
  lists: Prisma.ListGetPayload<{
    include: {
      user: true;
      _count: {
        select: {
          items: true;
        };
      };
    };
  }>[];
};

export default async function WishListsTab({ lists }: Props) {
  return (
    <TabsContent value="wishlists" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Wish Lists</CardTitle>
          <CardDescription>Gift ideas for this event</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lists.map((list) => (
              <Card key={list.id}>
                <CardHeader>
                  <CardTitle className="text-base">{list.name}</CardTitle>
                  <CardDescription>{list.userId}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{list._count.items} items</p>
                </CardContent>
                <CardFooter>
                  <Link href={`/dashboard/wish-list/${list.id}`} className={buttonVariants({ size: 'sm', className: 'w-full' })}>
                    View Wish List
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
