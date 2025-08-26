'use client';

import { useQuery } from '@tanstack/react-query';
import { JSONContent } from '@tiptap/react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

import { getList } from '@/app/actions';
import { GetList } from '@/lib/queries/items';

import { useMe } from '@/hooks/use-me';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { buttonVariants } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import Viewer from './ui/rich-text/viewer';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

type Props = {
  list: GetList;
  includeUser?: boolean;
};

export default function WishListCard({ list, includeUser = false }: Props) {
  const { data: me } = useMe();
  const { data, isLoading } = useQuery({
    queryKey: ['list', list.id],
    queryFn: () => getList(list.id),
    initialData: list,
  });

  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const isOwner = data.user.id === me?.id;

  return (
    <Card>
      <CardHeader className="flex items-center flex-row gap-2 pb-2">
        {includeUser && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="shadow-inner hover:shadow-lg transition-all duration-200">
                  <AvatarImage src={data.user.image ?? undefined} />
                  <AvatarFallback>{data.user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{data.user.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <div className="flex flex-col">
          <CardTitle className="text-2xl leading-none">{data.name}</CardTitle>
          <CardDescription>{data.user.name}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {/* {data.description && (
          <p className="text-sm text-muted-foreground leading-none mb-4">{data.description}</p>
        )} */}
        {data.description && (
          <Viewer
            content={data.description as JSONContent}
            immediatelyRender={false}
            className="text-sm text-muted-foreground leading-none mb-4"
            excerpt
          />
        )}
        <div className="flex items-center justify-between text-sm">
          <span>{data.items.length} items</span>
          <span className="text-muted-foreground">Last updated {formatDistanceToNow(new Date(data.updatedAt), { addSuffix: true })}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isOwner && (
          <Link href={`/dashboard/wish-lists/${data.id}/edit`} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            Edit
          </Link>
        )}
        <Link href={`/dashboard/wish-lists/${data.id}`} className={buttonVariants({ size: 'sm' })}>
          View
        </Link>
      </CardFooter>
    </Card>
  );
}
