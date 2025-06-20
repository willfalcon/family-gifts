'use client';

import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { JSONContent } from '@tiptap/react';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

import { ItemFromGetList } from '@/lib/queries/items';
import { capitalize, formatCurrency } from '@/lib/utils';
import { getItem } from '../actions';
import useViewMode from './useViewMode';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

  const [viewMode] = useViewMode();

  if (isLoading || !item) {
    return <ItemSkeleton />;
  }

  if (viewMode === 'compact') {
    return (
      <div className="flex items-center gap-3 py-2 px-3 border-b last:border-b-0 hover:bg-muted/30 transition-colors">
        {!isOwner && <Purchased item={item} />}

        {/* Item name - takes up most space */}
        <div className="flex-1 min-w-0">
          <span className="font-medium truncate">{item.name}</span>
        </div>

        {/* Priority indicator - compact badge */}
        {item.priority && (
          <Badge
            variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}
            className="text-xs px-2 py-0 flex-shrink-0"
          >
            {item.priority.charAt(0)}
          </Badge>
        )}

        {/* Price */}
        <span className="font-medium text-sm flex-shrink-0 min-w-[60px] text-right">{item.price}</span>

        {/* Purchase status indicator - compact */}
        {item.purchasedBy.length > 0 && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="flex -space-x-1">
              {item.purchasedBy.slice(0, 2).map((purchaser) => (
                <Avatar key={purchaser.id} className="h-5 w-5 border border-background">
                  <AvatarImage src={purchaser.image || '/placeholder.svg'} alt={purchaser.name || ''} />
                  <AvatarFallback className="text-xs">{purchaser.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
              {item.purchasedBy.length > 2 && (
                <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs border border-background">
                  +{item.purchasedBy.length - 2}
                </div>
              )}
            </div>
          </div>
        )}

        {/* External link - compact icon button */}
        {item.link && (
          <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" asChild>
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3" />
              <span className="sr-only">View item</span>
            </a>
          </Button>
        )}
      </div>
    );
  }
  return (
    item && (
      <Card key={item.id} className="overflow-hidden mb-4">
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
