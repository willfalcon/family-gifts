'use client';

import { Button } from '@/components/ui/button';
import { Item } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { ItemSchema, ItemSchemaType } from './itemSchema';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import ItemForm from './ItemForm';
import { editItem } from './actions';
import { Edit } from 'lucide-react';

export default function ItemEdit(props: Item & { categories: string[] }) {
  const { categories, ...item } = props;
  const [open, setOpen] = useState(false);

  const form = useForm<ItemSchemaType>({
    resolver: zodResolver(ItemSchema),
    defaultValues: { ...item, categories: [] } as ItemSchemaType,
  });

  async function onSubmit(values: ItemSchemaType) {
    console.log('onSubmit');
    try {
      const res = await editItem(item.id, {
        ...values,
        notes: JSON.parse(JSON.stringify(values.notes || {})),
      });
      if (res.success) {
        toast.success('Item edited!');
        setOpen(false);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Edit />
          Edit Item
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit {item.name}</DialogTitle>
        </DialogHeader>
        <ItemForm form={form} onSubmit={onSubmit} text="Save" categories={categories} />
      </DialogContent>
    </Dialog>
  );
}
