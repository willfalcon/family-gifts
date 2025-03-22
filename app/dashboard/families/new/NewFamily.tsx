'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getDefaults } from '@/lib/utils';

import { useMutation } from '@tanstack/react-query';
import { FamilySchema, FamilySchemaType } from '../../manage-family/familySchema';
import { createFamily } from './actions';
import FamilyForm from '../../manage-family/FamilyForm';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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
    onSuccess(data, variables, context) {
      console.log(data);
      toast.success(`${data.name} created!`);
      router.push(`/dashboard/family/${data.id}`);
    },
  });

  function onSubmit(values: FamilySchemaType) {
    mutation.mutate(values);
  }

  const membersArray = useFieldArray({
    name: 'members',
    control: form.control,
  });

  return <FamilyForm form={form} onSubmit={onSubmit} submitText="Create Family" membersArray={membersArray} pending={mutation.isPending} />;
}
