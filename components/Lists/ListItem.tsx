import { Item } from '@prisma/client';
import Image from 'next/image';
import ItemDelete from '../../app/dashboard/wish-list/ItemDelete';
import ItemEdit from '../../app/dashboard/wish-list/ItemEdit';

export default function ListItem(
  props: Item & {
    categories: string[];
  },
) {
  const imageSize = 150;
  const { categories, ...item } = props;
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
        <p className="text-sm text-muted-foreground">{item.notes}</p>
        <p className="text-sm text-muted-foreground">{item.category}</p>
      </div>
      <div className="flex space-x-2">
        <ItemEdit {...item} categories={categories} />
        <ItemDelete id={item.id} />
      </div>
    </li>
  );
}
