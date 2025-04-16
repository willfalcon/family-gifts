'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { FamilySchema, FamilySchemaType } from '@/app/dashboard/families/familySchema';
import { GetFamily } from '@/lib/queries/families';
import { updateFamily } from '../../actions';

import FamilyForm from '@/app/dashboard/families/FamilyForm';

export default function EditFamily({ family }: { family: GetFamily }) {
  const form = useForm<FamilySchemaType>({
    resolver: zodResolver(FamilySchema),
    defaultValues: {
      name: family.name,
      members: family.members.map((member) => ({ value: member.id })),
      description: JSON.parse(JSON.stringify(family.description || {})),
    },
  });

  const router = useRouter();

  const mutation = useMutation({
    async mutationFn(values: FamilySchemaType) {
      return await updateFamily(family.id, values);
    },
    onSuccess(data, variables, context) {
      toast.success(`${data.name} updated!`);
      router.push(`/dashboard/families/${data.id}`);
    },
    onError(error, variables, context) {
      console.error(error);
      toast.error('Something went wrong!');
    },
  });

  function onSubmit(values: FamilySchemaType) {
    mutation.mutate(values);
  }

  const membersArray = useFieldArray({
    name: 'members',
    control: form.control,
  });

  return <FamilyForm form={form} onSubmit={onSubmit} submitText="Update Family" membersArray={membersArray} pending={mutation.isPending} />;
}
