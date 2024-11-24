'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ListForm from './ListForm';
import { useForm } from 'react-hook-form';
import { ListSchema, ListSchemaType } from './listSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { getDefaults } from '@/lib/utils';
import { toast } from 'sonner';
import { createList } from './actions';
import { useState } from 'react';

export default function CreateList() {
  const [open, setOpen] = useState(false);

  const form = useForm<ListSchemaType>({
    resolver: zodResolver(ListSchema),
    defaultValues: getDefaults(ListSchema),
  });
  async function onSubmit(values: ListSchemaType) {
    try {
      const newList = await createList({
        ...values,
      });
      if (newList.success) {
        toast.success('List Created!');
        form.reset();
        setOpen(false);
      } else {
        toast.error(newList.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create New List</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New List</DialogTitle>
        </DialogHeader>
        <ListForm form={form} onSubmit={onSubmit} submitText="Create" />
      </DialogContent>
    </Dialog>
  );
}
