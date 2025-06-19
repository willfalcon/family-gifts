'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { updateList } from '@/app/dashboard/wish-lists/actions';
import { ListSchema, type ListSchemaType } from '@/app/dashboard/wish-lists/listSchema';
import { type GetListForEdit } from '@/lib/queries/items';

import ListForm from '../../components/ListForm';

type Props = {
  list: GetListForEdit;
};

export default function EditList({ list }: Props) {
  const form = useForm<ListSchemaType>({
    resolver: zodResolver(ListSchema),
    defaultValues: {
      ...list,
      description: JSON.parse(JSON.stringify(list.description || {})),
      visibleToFamilies: list.visibleToFamilies.map((family) => family.id),
      visibleToEvents: list.visibleToEvents.map((event) => event.id),
      visibleToUsers: list.visibleToUsers.map((user) => user.id),
    },
  });

  async function onSubmit(values: ListSchemaType) {
    try {
      await updateList(list.id, values);
      toast.success('List updated');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  }

  return <ListForm form={form} onSubmit={onSubmit} submitText="Save" shareLinkId={list.shareLink} />;
}
