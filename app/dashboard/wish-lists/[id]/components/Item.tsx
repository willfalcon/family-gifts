import { Badge } from '@/components/ui/badge';
import { Item } from '@prisma/client';

import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { JSONContent } from '@tiptap/react';
import Viewer from '@/components/ui/rich-text/viewer';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { ItemFromGetList } from '@/lib/queries/items';
import Purchased from './Purchased';
import { capitalize } from '@/lib/utils';

type Props = {
  item: ItemFromGetList;
  isOwner: boolean;
};
export default function WishListItem({ item, isOwner }: Props) {
  return (
    <Card key={item.id} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-48 h-48 relative">
            <Image src={item.image || 'https://placehold.co/300'} alt={item.name} fill className="object-cover" />
          </div>
          <div className="flex-1 p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h3 className="font-semibold text-xl">{item.name}</h3>
                <Viewer content={item.notes as JSONContent} className="text-muted-foreground" immediatelyRender={false} />
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-medium">${item.price}</span>
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
              <div className="flex flex-col items-start md:items-end gap-2">
                {item.link && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Item
                    </a>
                  </Button>
                )}
                {!isOwner && <Purchased item={item} />}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
