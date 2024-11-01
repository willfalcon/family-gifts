'use client';

import { Button } from '@/components/ui/button';
import { Item } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { ItemSchema, ItemSchemaType } from './wishListSchema';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';
import { editItem } from './actions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import WishListForm from './WishListForm';
import { useState } from 'react';

export default function ItemEdit(props: Item & { categories: string[] }) {
  const { categories, ...item } = props;
  const [open, setOpen] = useState(false);

  const form = useForm<ItemSchemaType>({
    resolver: zodResolver(ItemSchema),
    defaultValues: item as ItemSchemaType,
  });

  async function onSubmit(values: ItemSchemaType) {
    console.log(values);
    try {
      const res = await editItem(item.id, values);
      if (res.success) {
        toast.success('Item edited!');
        setOpen(false);
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Edit Item</Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Edit {item.name}</DialogTitle>
        </DialogHeader>
        <WishListForm form={form} onSubmit={onSubmit} text="Edit" categories={categories} />
      </DialogContent>
    </Dialog>
  );
}
