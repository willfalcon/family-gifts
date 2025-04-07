'use client';

import { Prisma } from '@prisma/client';
import { JSONContent } from '@tiptap/react';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

import { getList } from '@/app/actions';

import { buttonVariants } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import Viewer from './ui/rich-text/viewer';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

type Props = {
  list: Prisma.ListGetPayload<{
    include: {
      _count: {
        select: {
          items: true;
        };
      };
    };
  }>;
  includeUser?: boolean;
};

export default function WishListCard({ list, includeUser = false }: Props) {
  const session = useSession();
  const { data, isLoading } = useQuery({
    queryKey: ['list', list.id],
    queryFn: () => getList(list.id),
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

  const isOwner = data.user.id === session.data?.user?.id;
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

        <CardTitle className="text-2xl leading-none">{data.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.description && (
          <Viewer content={data.description as JSONContent} immediatelyRender={false} className="text-sm text-muted-foreground leading-none mb-4" />
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
