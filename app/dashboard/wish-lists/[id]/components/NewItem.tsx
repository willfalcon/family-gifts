'use client';

import { getDefaults } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { createItem, maybeGetImage } from '../actions';
import { ItemSchema, ItemSchemaType } from '../itemSchema';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { List } from '@prisma/client';
import ItemForm from './ItemForm';

export default function NewItem({ categories, listId }: { categories: string[]; listId: List['id'] }) {
  const form = useForm<ItemSchemaType>({
    resolver: zodResolver(ItemSchema),
    defaultValues: getDefaults(ItemSchema),
  });

  const [open, setOpen] = useState(false);

  async function onSubmit(values: ItemSchemaType) {
    const { image, ...rest } = values;
    let imageUrl = null;
    if (image) {
      imageUrl = await fetch(`/api/uploadImage?name=${image.name}`, {
        method: 'POST',
        body: image,
      })
        .then((res) => res.text())
        .catch((err) => {
          console.error(err);
          return null;
        });
    }
    try {
      const newItem = await createItem({
        ...rest,
        notes: JSON.parse(JSON.stringify(values.notes || {})),
        listId,
        ...(imageUrl ? { imageUrl } : {}),
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
