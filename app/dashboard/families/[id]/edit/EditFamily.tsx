'use client';

import { FamilySchema, FamilySchemaType } from '@/app/dashboard/families/familySchema';
import { useFieldArray } from 'react-hook-form';
import { FamilyFromGetFamily } from '@/lib/queries/families';
import { getDefaults } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import FamilyForm from '@/app/dashboard/families/FamilyForm';

export default function EditFamily({ family }: { family: FamilyFromGetFamily }) {
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
      // const family = await (values);
      // return family;
    },
    onSuccess(data, variables, context) {
      console.log(data);
      toast.success(`${data.name} updated!`);
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
