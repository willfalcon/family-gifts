'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { getDefaults } from '@/lib/utils';
import { createList } from './actions';

import { ListSchema, type ListSchemaType } from '../listSchema';
import ListForm from '../components/ListForm';
import SetBreadcrumbs from '@/components/SetBreadcrumbs';

export default function NewListForm() {
  const form = useForm<ListSchemaType>({
    resolver: zodResolver(ListSchema),
    defaultValues: getDefaults(ListSchema),
  });
  const router = useRouter();
  async function onSubmit(values: ListSchemaType) {
    try {
      const newList = await createList({
        ...values,
        description: JSON.parse(JSON.stringify(values.description || {})),
      });
      toast.success('List Created!');
      router.push(`/dashboard/wish-lists/${newList.id}`);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  }
  return (
    <>
      <SetBreadcrumbs
        items={[
          { name: 'Wish Lists', href: '/dashboard/wish-lists' },
          { name: 'New', href: '/dashboard/wish-lists/new' },
        ]}
      />
      <ListForm form={form} onSubmit={onSubmit} submitText="Create" />
    </>
  );
}
