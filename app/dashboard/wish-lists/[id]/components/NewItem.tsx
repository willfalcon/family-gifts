'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { getDefaults } from '@/lib/utils';
import { createItem, maybeGetImage } from '../actions';
import { ItemSchema, ItemSchemaType } from '../itemSchema';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import ItemForm from './ItemForm';

export default function NewItem({ categories }: { categories: string[] }) {
  const form = useForm<ItemSchemaType>({
    resolver: zodResolver(ItemSchema),
    defaultValues: getDefaults(ItemSchema),
  });

  const pathname = usePathname();
  const segments = pathname.split('/');
  const listId = segments[segments.indexOf('wish-list') + 1];

  const [open, setOpen] = useState(false);

  async function onSubmit(values: ItemSchemaType) {
    try {
      const newItem = await createItem({
        ...values,
        notes: JSON.parse(JSON.stringify(values.notes || {})),
        listId,
      });

      toast.success('Item added!');
      form.reset();
      setOpen(false);
      if (newItem?.link && !newItem.image) {
        await maybeGetImage(newItem);
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="max-w-2xl max-h-5/6 flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Item</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <ItemForm form={form} onSubmit={onSubmit} text="Add" categories={categories} className="px-1" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
