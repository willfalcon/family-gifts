'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { ItemSchema, ItemSchemaType } from '../itemSchema';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Item } from '@prisma/client';
import { toast } from 'sonner';
import { updateItem } from '../edit/actions';
import ItemForm from './ItemForm';

export default function EditItem({ categories, item }: { categories: string[]; item: Item }) {
  const { image, ...initialItem } = item;

  const form = useForm<ItemSchemaType>({
    resolver: zodResolver(ItemSchema),
    defaultValues: {
      ...initialItem,
      notes: JSON.parse(JSON.stringify(initialItem.notes || {})),
      link: initialItem.link || undefined,
      imageUrl: image || undefined,
    },
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
      await updateItem(item.id, {
        ...rest,
        notes: JSON.parse(JSON.stringify(values.notes || {})),
        ...(imageUrl ? { imageUrl } : {}),
      });
      toast.success('Item updated!');
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Pencil />
          <span className="sr-only">Edit Item</span>
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
