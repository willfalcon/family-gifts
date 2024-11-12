import { auth } from '@/auth';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ItemEdit from './ItemEdit';
import { ExternalLinkIcon } from '@radix-ui/react-icons';

import { Badge } from '@/components/ui/badge';
import ItemDelete from './ItemDelete';
import { ItemWithRefs } from '@/prisma/types';
import MarkAsBought from './MarkAsBought';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TooltipContent } from '@radix-ui/react-tooltip';
import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { getActiveMember } from '@/lib/queries/family-members';

export default async function ListItem(
  props: ItemWithRefs & {
    categories: string[];
  },
) {
  const session = await auth();

  const { categories, ...item } = props;

  const isOwner = session?.user.id === item.member.userId;

  const me = await getActiveMember();

  return (
    <Card className="relative">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>
          {item.link ? (
            <a href={item.link} target="_blank" className="flex items-center space-x-2">
              <span>{item.name}</span>
              <ExternalLinkIcon />
            </a>
          ) : (
            item.name
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AspectRatio ratio={1 / 1}>
          {item.image ? (
            <Image src={item.image} alt={item.name} width={1000} height={1000} className="object-cover rounded-md" />
          ) : (
            <img src="https://placehold.co/1000x1000" alt={item.name} className="object-cover rounded-md" />
          )}
        </AspectRatio>
        {item.notes && <p>{item.notes}</p>}
      </CardContent>
      <CardFooter className="justify-between">
        {isOwner && (
          <>
            <ItemEdit {...item} categories={categories} />
            <ItemDelete id={item.id} />
          </>
        )}
        {!isOwner && (
          <>
            {!!item.boughtBy.length && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge className="bg-green-500">Bought</Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Bought by {item.boughtBy.map((member) => member.name).join(', ')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {!item.boughtBy.some((b) => b.id === me?.id) && <MarkAsBought {...item} />}
          </>
        )}
      </CardFooter>
    </Card>
  );
}
