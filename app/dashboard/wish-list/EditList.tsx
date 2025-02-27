'use client';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';

import ListForm from '../wish-lists/ListForm';
import { ListSchema, ListSchemaType } from '../wish-lists/listSchema';
import { updateList } from '../wish-lists/actions';
import { ListWithItems } from '@/prisma/types';

export default function EditList(list: ListWithItems) {
  const form = useForm<ListSchemaType>({
    resolver: zodResolver(ListSchema),
    defaultValues: { ...list, visibleTo: list.visibleTo.map((user) => user.id) },
  });
  async function onSubmit(values: ListSchemaType) {
    try {
      const newList = await updateList(list.id, { ...values });
      if (newList.success) {
        toast.success('List settings updated!');
      } else {
        toast.error(newList.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  }
  return <ListForm form={form} onSubmit={onSubmit} submitText="Save" />;
}
