'use client';

import { useSearchParams } from 'next/navigation';
import CategoriesFilter from './CategoriesFilter';
import ListItem from '../../app/dashboard/wish-list/ListItem';
import { ListWithItems } from '@/prisma/types';

type Props = {
  categories: string[];
  items: ListWithItems['items'];
  all?: boolean;
};

export default function WishList({ categories, items, all = false }: Props) {
  const searchParams = useSearchParams();
  const activeCategories = searchParams.get('category')?.split(',') || [];
  const filteredItems = activeCategories.length ? items.filter((item) => activeCategories.includes(item.category!)) : items;

  return (
    <div className="flex gap-6 max-w-[1000px]">
      <CategoriesFilter categories={categories} active={activeCategories} />
      <div className="flex-1">
        <p className="mb-2 text-sm text-muted-foreground">{activeCategories.length ? activeCategories.join(', ') : 'All'}</p>
        <ul className="space-y-4">
          {filteredItems.map((item) => (
            <ListItem key={item.id} {...item} categories={categories} all={all} />
          ))}
        </ul>
      </div>
    </div>
  );
}
