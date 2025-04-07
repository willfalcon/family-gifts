'use client';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { EventFromGetEvent } from '@/lib/queries/events';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getListsByEvent } from '../actions';
import WishListCard from '@/components/WishListCard';

type Props = {
  event: EventFromGetEvent;
};

export default function WishListsTab({ event }: Props) {
  const { data: lists, isLoading } = useQuery({
    queryKey: ['lists', event.id],
    queryFn: () => getListsByEvent(event.id),
  });

  return (
    <TabsContent value="wishlists" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Wish Lists</CardTitle>
          <CardDescription>Gift ideas for this event</CardDescription>
        </CardHeader>
        <CardContent className="@container">
          <div className="grid gap-4 @md:grid-cols-2 @4xl:grid-cols-3">
            {isLoading && <div className="flex items-center justify-center h-full">Loading...</div>}
            {lists?.map((list) => <WishListCard key={list.id} list={list} includeUser />)}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
