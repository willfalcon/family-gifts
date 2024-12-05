import { Item } from '@prisma/client';
import Image from 'next/image';
import ItemDelete from '../../app/dashboard/wish-list/ItemDelete';
import ItemEdit from '../../app/dashboard/wish-list/ItemEdit';
import { ItemWithRefs } from '@/prisma/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMe } from '@/app/dashboard/Providers';
import { Button } from '../ui/button';
import MarkAsBought from './MarkAsBought';
import { Skeleton } from '../ui/skeleton';

export default function ListItem(
  props: ItemWithRefs & {
    categories: string[];
    all: boolean;
  },
) {
  const imageSize = 150;
  const { categories, all, ...item } = props;
  const pathName = usePathname();
  const familyId = pathName.split('/')[3];

  const { data: me, isLoading } = useMe();
  const isOwner = item.memberId === me?.id;

  return (
    <li key={item.id} className="flex gap-4 items-center justify-between p-4 border rounded-xl shadow">
      {item.image ? (
        <Image src={item.image} alt={item.name} width={imageSize} height={imageSize} className="object-cover rounded-md" />
      ) : (
        <img
          src={`https://placehold.co/${imageSize}x${imageSize}`}
          alt={item.name}
          className={`object-cover rounded-md w-[${imageSize}px] h-[${imageSize}px]`}
        />
      )}

      <div className="flex-1">
        <h3 className="font-semibold">{item.name}</h3>
        {all && item.list && (
          <Link href={`/dashboard/family/${familyId}/list/${item.list.id}`} className="text-sm text-muted-foreground">
            List: {item.list?.name}
          </Link>
        )}
        <p className="text-sm text-muted-foreground">{item.notes}</p>
        <p className="text-sm text-muted-foreground">{item.category}</p>
      </div>
      <div className="flex space-x-2">
        {isLoading ? (
          <Skeleton className="h-8 w-32" />
        ) : isOwner ? (
          <>
            <ItemEdit {...item} categories={categories} />
            <ItemDelete id={item.id} />
          </>
        ) : (
          <MarkAsBought id={item.id} bought={item.boughtBy} />
        )}
      </div>
    </li>
  );
}
