import { JSONContent } from '@tiptap/react';
import { Pencil, Share2 } from 'lucide-react';
import Link from 'next/link';

import { GetList } from '@/lib/queries/items';
import { buttonVariants } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import Viewer from '@/components/ui/rich-text/viewer';

import Title from '@/components/Title';
import NewItem from './NewItem';
import { Badge } from '@/components/ui/badge';

type Props = {
  list: GetList;
  categories: string[];
  isOwner: boolean;
};

export default function WishListHeader({ list, categories, isOwner }: Props) {
  let visibleTo: string[] = [];
  list.visibleToFamilies.map((family) => {
    visibleTo.push(family.name);
  });
  list.visibleToEvents.map((event) => {
    visibleTo.push(event.name);
  });
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Title>{list.name}</Title>
          <Viewer content={list.description as JSONContent} className="text-muted-foreground" immediatelyRender={false} />
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm">By {list.user.name}</span>
            {visibleTo.map((visible) => (
              <>
                <span className="text-muted-foreground">•</span>
                <Badge variant="outline">{visible}</Badge>
              </>
            ))}
            {/* TODO: add message anonymously */}
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
              <NewItem categories={categories} />
              <Link href={`/dashboard/wish-lists/${list.id}/edit`} className={buttonVariants({ variant: 'outline' })}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
