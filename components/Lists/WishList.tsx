'use client';

import { useSearchParams } from 'next/navigation';
import CategoriesFilter from './CategoriesFilter';
import { ListWithItems } from '@/prisma/types';
import ListItem from './ListItem';

type Props = ListWithItems & {
  categories: string[];
};
export default function WishList(props: Props) {
  const { categories, ...list } = props;
  const searchParams = useSearchParams();
  const activeCategories = searchParams.get('category')?.split(',') || [];
  const filteredItems = activeCategories.length ? list.items.filter((item) => activeCategories.includes(item.category!)) : list.items;

  return (
    <div className="flex gap-6 max-w-[1000px]">
      <CategoriesFilter categories={categories} active={activeCategories} />
      <div className="flex-1">
        <p className="mb-2 text-sm text-muted-foreground">{activeCategories.length ? activeCategories.join(', ') : 'All'}</p>
        <ul className="space-y-4">
          {filteredItems.map((item) => (
            <ListItem key={item.id} {...item} categories={categories} />
          ))}
        </ul>
      </div>
    </div>
  );
}
