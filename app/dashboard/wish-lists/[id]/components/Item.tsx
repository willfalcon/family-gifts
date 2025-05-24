'use client';

import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { JSONContent } from '@tiptap/react';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

import { ItemFromGetList } from '@/lib/queries/items';
import { capitalize, formatCurrency } from '@/lib/utils';
import { getItem } from '../actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Viewer from '@/components/ui/rich-text/viewer';
import { Skeleton } from '@/components/ui/skeleton';
import DeleteItem from './DeleteItem';
import EditItem from './EditItem';
import Purchased from './Purchased';

type Props = {
  item: ItemFromGetList;
  isOwner: boolean;
  categories: string[];
};
export default function WishListItem({ item: initialItem, isOwner, categories }: Props) {
  const { data: item, isLoading } = useQuery({
    queryKey: ['item', initialItem.id],
    queryFn: () => getItem(initialItem.id),
    initialData: initialItem,
  });

  if (isLoading) {
    return <ItemSkeleton />;
  }

  return (
    item && (
      <Card key={item.id} className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-48 h-48 relative">
              <Image src={item.image || 'https://placehold.co/300'} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-1 p-6">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <h3 className="font-semibold text-xl">{item.name}</h3>
                  <Viewer content={item.notes as JSONContent} className="text-muted-foreground" immediatelyRender={false} />
                  <div className="flex items-center gap-2 mt-2">
                    {item.price && <span className="font-medium">{formatCurrency(item.price)}</span>}
                    {item.priority && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <Badge variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}>
                          {capitalize(item.priority)} Priority
                        </Badge>
                      </>
                    )}
                  </div>
                  {item.categories && item.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.categories.map((category) => (
                        <Badge key={category} variant="outline">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-start  md:items-end gap-2">
                  {item.link && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Item
                      </a>
                    </Button>
                  )}
                  {!isOwner && <Purchased item={item} />}
                  {isOwner && <EditItem categories={categories} item={item} />}
                  {isOwner && <DeleteItem item={item} />}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  );
}

function ItemSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-48 h-48 relative">
            <Skeleton className="w-full h-full" />
          </div>
          <div className="flex-1 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <div className="flex items-center gap-2 mt-2">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                </div>
                <Skeleton className="w-full h-4" />
              </div>
              <div className="flex items-start  md:items-end gap-2">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
