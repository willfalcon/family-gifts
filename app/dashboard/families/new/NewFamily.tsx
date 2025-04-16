'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useBreadcrumbs } from '@/components/HeaderBreadcrumbs';
import { getDefaults } from '@/lib/utils';
import { FamilySchema, FamilySchemaType } from '../familySchema';
import { createFamily } from './actions';

import FamilyForm from '../FamilyForm';

type Props = {
  afterSubmit?: () => void;
};

export default function NewFamily({ afterSubmit }: Props) {
  const form = useForm<FamilySchemaType>({
    resolver: zodResolver(FamilySchema),
    defaultValues: {
      ...getDefaults(FamilySchema),
      members: [{ value: '' }],
    },
  });

  const router = useRouter();

  const mutation = useMutation({
    async mutationFn(values: FamilySchemaType) {
      const family = await createFamily(values);
      return family;
    },
    onSuccess(data) {
      console.log(data);
      toast.success(`${data.name} created!`);
      router.push(`/dashboard/families/${data.id}`);
    },
  });

  function onSubmit(values: FamilySchemaType) {
    mutation.mutate(values);
  }

  const membersArray = useFieldArray({
    name: 'members',
    control: form.control,
  });

  const setBreadcrumbs = useBreadcrumbs();
  setBreadcrumbs([
    { name: 'Families', href: '/dashboard/families' },
    { name: 'New', href: '/dashboard/families/new' },
  ]);

  return <FamilyForm form={form} onSubmit={onSubmit} submitText="Create Family" membersArray={membersArray} pending={mutation.isPending} />;
}
