'use client';

import { JSONContent } from '@tiptap/react';
import { Pencil } from 'lucide-react';
import { User } from 'next-auth';
import Link from 'next/link';
import { Fragment } from 'react';

import { GetList } from '@/lib/queries/items';

import AnonymousMessageDialog from '@/components/Messages/AnonymousMessageDialog';
import { ShareButton } from '@/components/ShareButton';
import Title from '@/components/Title';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import Viewer from '@/components/ui/rich-text/viewer';

import Favorite from '@/app/dashboard/components/Favorite';
import NewItem from './NewItem';
import ViewModeToggle from './ViewModeToggle';

type Props = {
  list: GetList;
  categories: string[];
  isOwner: boolean;
  me: User | undefined;
};

export default function WishListHeader({ list, categories, isOwner, me }: Props) {
  let visibleTo: string[] = [];
  list.visibleToFamilies.map((family) => {
    visibleTo.push(family.name);
  });
  list.visibleToEvents.map((event) => {
    visibleTo.push(event.name);
  });
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Title>{list.name}</Title>
            <Favorite id={list.id} type="list" />
          </div>
          <Viewer content={list.description as JSONContent} className="text-muted-foreground" immediatelyRender={false} />
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm">By {list.user.name}</span>
            {visibleTo.map((visible) => (
              <Fragment key={visible}>
                <span className="text-muted-foreground">•</span>
                <Badge variant="outline">{visible}</Badge>
              </Fragment>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          {list.visibilityType === 'public' && <ShareButton />}
          {!isOwner && me?.id && <AnonymousMessageDialog user={me.id} dmId={list.user.id} />}
          {isOwner && (
            <>
              <NewItem categories={categories} listId={list.id} />
              <Link href={`/dashboard/wish-lists/${list.id}/edit`} className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </>
          )}
        </div>
        <ViewModeToggle />
      </div>
    </div>
  );
}
