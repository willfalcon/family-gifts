import { Gift, Plus, Search } from 'lucide-react';
import Link from 'next/link';

import { GetFamily, MemberFromGetFamily } from '@/lib/queries/families';

import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TabsContent } from '@/components/ui/tabs';
import WishListCard from '@/components/WishListCard';
import { GetList } from '@/lib/queries/items';

type Props = {
  members: MemberFromGetFamily[];
  family: GetFamily;
};

export default function WishListsTab({ members, family }: Props) {
  const lists = members.reduce<GetList[]>((lists, member) => {
    member.lists.forEach((list) => {
      if (!lists.some((l) => l.id === list.id)) {
        lists.push(list);
      }
    });
    return lists;
  }, []);

  return (
    <>
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Families', href: '/dashboard/families' },
          { name: family.name, href: `/dashboard/families/${family.id}` },
          { name: 'Wish Lists', href: `/dashboard/families/${family.id}?tab=wishlists` },
        ]}
      />
      <TabsContent value="wishlists" className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Wish Lists</CardTitle>
              <CardDescription>Wish lists created by family members</CardDescription>
            </div>

            <Link href="/dashboard/wish-lists/new" className={buttonVariants({ size: 'sm' })}>
              <Plus className="mr-2 h-4 w-4" />
              Create Wish List
            </Link>
          </CardHeader>
          <CardContent>
            <div className="relative w-full mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search wish lists..." className="w-full pl-8" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lists.map((list) => {
                const owner = members.find((m) => m.id === list.userId);
                return <WishListCard key={list.id} list={list} includeUser />;
                // return (
                //   <Card key={list.id}>
                //     <CardHeader className="p-4 pb-2">
                //       <CardTitle className="text-lg">{list.name}</CardTitle>
                //       <CardDescription className="flex items-center gap-2">
                //         {owner && (
                //           <Avatar className="h-5 w-5">
                //             <AvatarImage src={owner.image || undefined} alt={owner.name || ''} />
                //             <AvatarFallback className="text-[10px]">
                //               {owner.name
                //                 ?.split(' ')
                //                 .map((n) => n[0])
                //                 .join('')}
                //             </AvatarFallback>
                //           </Avatar>
                //         )}
                //         {owner?.name}
                //       </CardDescription>
                //     </CardHeader>
                //     <CardContent className="p-4 pt-0">
                //       <div className="flex items-center justify-between text-sm mt-2">
                //         <span>{list._count.items} items</span>
                //         <span className="text-muted-foreground">Updated {formatDistanceToNow(list.updatedAt)}</span>
                //       </div>
                //     </CardContent>
                //     <CardFooter className="p-4 pt-0">
                //       <Button size="sm" className="w-full" asChild>
                //         <Link href={`/dashboard/wish-lists/${list.id}`}>View Wish List</Link>
                //       </Button>
                //     </CardFooter>
                //   </Card>
                // );
              })}

              <Card className="border-dashed flex flex-col items-center justify-center p-8">
                <Gift className="h-8 w-8 text-muted-foreground mb-4" />
                <h3 className="font-medium text-center mb-2">Create a new wish list</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">Start a personal or shared wish list</p>
                <Button asChild>
                  <Link href="/dashboard/wish-lists/new">
                    <Plus className="mr-2 h-4 w-4" />
                    New Wish List
                  </Link>
                </Button>
              </Card>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
}
