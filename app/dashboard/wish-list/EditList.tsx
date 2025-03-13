'use client';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';

import ListForm from '../wish-lists/ListForm';
import { ListSchema, ListSchemaType } from '../wish-lists/listSchema';
import { updateList } from '../wish-lists/actions';
import { ListForWishListPage } from '@/prisma/types';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Scroll, Settings } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function EditList(list: ListForWishListPage) {
  const form = useForm<ListSchemaType>({
    resolver: zodResolver(ListSchema),
    defaultValues: { ...list, visibleTo: list.visibleTo.map((user) => user.id) },
  });
  async function onSubmit(values: ListSchemaType) {
    try {
      const updatedList = await updateList(list.id, { ...values, description: JSON.parse(JSON.stringify(values.description || {})) });
      if (updatedList.success) {
        toast.success('List settings updated!');
      } else {
        toast.error(updatedList.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  }
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button asChild>
        <DialogTrigger>
          <Settings />
          List Settings
        </DialogTrigger>
      </Button>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>List Settings</DialogTitle>
          <DialogDescription>Update your wish list details and items</DialogDescription>
        </DialogHeader>
        <ScrollArea>
          <ListForm form={form} onSubmit={onSubmit} submitText="Save" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
