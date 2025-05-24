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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ItemForm from './ItemForm';

export default function NewItem({ categories, listId }: { categories: string[]; listId: List['id'] }) {
  const form = useForm<ItemSchemaType>({
    resolver: zodResolver(ItemSchema),
    defaultValues: getDefaults(ItemSchema),
  });

  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (values: ItemSchemaType) => {
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

      const updatedList = await createItem({
        ...rest,
        notes: JSON.parse(JSON.stringify(values.notes || {})),
        listId,
        ...(imageUrl ? { imageUrl } : {}),
      });
      return updatedList;
    },
    onSuccess: async (list) => {
      toast.success('Item added!');
      form.reset();
      setOpen(false);
      queryClient.setQueryData(['list', listId], list);
      const newItem = list.items[list.items.length - 1];
      if (newItem?.link && !newItem.image) {
        await maybeGetImage(newItem);
      }
    },
    onError: (err) => {
      console.error(err);
      toast.error('Something went wrong!');
    },
  });

  async function onSubmit(values: ItemSchemaType) {
    mutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="max-w-2xl h-[90vh] flex flex-col pr-4">
        <DialogHeader>
          <DialogTitle>Add Item</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <ItemForm form={form} onSubmit={onSubmit} text="Add" categories={categories} className="px-1" />
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
