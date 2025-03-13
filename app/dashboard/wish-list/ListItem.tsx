'use client';

import Image from 'next/image';
import ItemDelete from './ItemDelete';
import ItemEdit from './ItemEdit';
import { ItemWithRefs, ListForWishListPage } from '@/prisma/types';
import { usePathname } from 'next/navigation';
import { useMe } from '@/app/dashboard/Providers';
// import { Button } from '../ui/button';
import MarkAsBought from './MarkAsBought';
import { Skeleton } from '../../../components/ui/skeleton';
import { Card, CardContent } from '../../../components/ui/card';
import Viewer from '../../../components/ui/rich-text/viewer';
import { JSONContent } from '@tiptap/react';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import currency from 'currency.js';
import { List } from '@prisma/client';

type Props = {
  item: ItemWithRefs;
  categories: string[];
  all?: boolean;
  list: ListForWishListPage;
};
export default function ListItem({ categories, all = false, item }: Props) {
  const imageSize = 150;
  const pathName = usePathname();
  const familyId = pathName.split('/')[3];

  const { data: me, isLoading } = useMe();
  const isOwner = item.member?.id === me?.id;

  return (
    <Card key={item.id} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {item.image ? (
            <Image src={item.image} alt={item.name} width={imageSize} height={imageSize} className="object-cover" />
          ) : (
            <Image
              src={`https://placehold.co/${imageSize}x${imageSize}`}
              width={imageSize}
              height={imageSize}
              alt={item.name}
              className={`object-cover w-[${imageSize}px] h-[${imageSize}px]`}
              unoptimized
            />
          )}

          <div className="flex-1 p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h3 className="font-semibold text-xl">{item.name}</h3>
                <Viewer className="text-muted-foreground" content={item.notes as JSONContent} immediatelyRender={false} />
                <div className="flex items-center gap-2 mt-2">
                  {item.price && (
                    <>
                      <span className="font-medium">{currency(item.price).format()}</span>
                      <span className="text-muted-foreground">•</span>
                    </>
                  )}
                  {item.priority && (
                    <Badge
                      variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}
                      className="rounded-full"
                    >
                      {item.priority.split('').map((s, i) => (i === 0 ? s.toUpperCase() : s))} Priority
                    </Badge>
                  )}
                </div>
                {item.categories && item.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.categories.map((category) => (
                      <Badge key={category} variant="outline" className="rounded-full">
                        {category}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col items-start md:items-end gap-2">
                {item.link && (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Item
                  </a>
                )}
              </div>

              <div className="flex gap-2 items-center">
                {isLoading ? (
                  <Skeleton className="h-8 w-32" />
                ) : isOwner ? (
                  <>
                    <ItemEdit {...item} categories={categories} />
                    <ItemDelete id={item.id} />
                  </>
                ) : (
                  <MarkAsBought item={item} />
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
