'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getDefaults } from '@/lib/utils';
import { ItemSchema, ItemSchemaType } from './wishListSchema';
import { createItem, maybeGetImage } from './actions';
import { toast } from 'sonner';
import WishListForm from './WishListForm';

export default function NewItem({ categories }: { categories: string[] }) {
  const form = useForm<ItemSchemaType>({
    resolver: zodResolver(ItemSchema),
    defaultValues: getDefaults(ItemSchema),
  });

  async function onSubmit(values: ItemSchemaType) {
    console.log(values);
    try {
      const newItem = await createItem(values);
      if (newItem.success) {
        toast.success('Item added!');
        form.reset();
        if (newItem?.item?.link && !newItem.item.image) {
          console.log('getting image');
          const imagereesult = await maybeGetImage(newItem.item);
          console.log(imagereesult);
        }
      } else {
        toast.error(newItem.error);
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  }
  return <WishListForm form={form} onSubmit={onSubmit} text="Add" categories={categories} />;
}
