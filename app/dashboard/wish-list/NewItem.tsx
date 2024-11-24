'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getDefaults } from '@/lib/utils';
import { ItemSchema, ItemSchemaType } from './wishListSchema';
import { createItem, maybeGetImage } from './actions';
import { toast } from 'sonner';
import ItemForm from './ItemForm';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogTitle } from '@radix-ui/react-dialog';
import { usePathname } from 'next/navigation';

export default function NewItem({ categories }: { categories: string[] }) {
  const form = useForm<ItemSchemaType>({
    resolver: zodResolver(ItemSchema),
    defaultValues: getDefaults(ItemSchema),
  });

  const pathname = usePathname();
  const segments = pathname.split('/');
  const listId = segments[segments.indexOf('wish-list') + 1];

  async function onSubmit(values: ItemSchemaType) {
    try {
      const newItem = await createItem({
        ...values,
        listId,
      });
      if (newItem.success) {
        toast.success('Item added!');
        form.reset();
        if (newItem?.item?.link && !newItem.item.image) {
          await maybeGetImage(newItem.item);
        }
      } else {
        toast.error(newItem.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Add Item</DialogTitle>
        </DialogHeader>
        <ItemForm form={form} onSubmit={onSubmit} text="Add" categories={categories} />
      </DialogContent>
    </Dialog>
  );
}
