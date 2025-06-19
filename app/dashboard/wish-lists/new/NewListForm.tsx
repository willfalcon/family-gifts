'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { getDefaults } from '@/lib/utils';
import { User } from '@prisma/client';
import { ListSchema, type ListSchemaType } from '../listSchema';
import { createList } from './actions';

import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import ListForm from '../components/ListForm';

export default function NewListForm({ user, shareLinkId }: { user: User; shareLinkId: string }) {
  const form = useForm<ListSchemaType>({
    resolver: zodResolver(ListSchema),
    defaultValues: {
      ...getDefaults(ListSchema),
      visibilityType: user.defaultListVisibility,
      shareLink: shareLinkId,
    },
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
