'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { FamilySchema, FamilySchemaType } from './familySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { getDefaults } from '@/lib/utils';
import { createFamily } from './actions';
import { toast } from 'sonner';
import FamilyForm from './FamilyForm';

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

  async function onSubmit(values: FamilySchemaType) {
    console.log(values);
    // try {
    //   const newFamily = await createFamily(values);
    //   if (newFamily.success) {
    //     toast.success('Family added!');
    //     form.reset();
    //     if (afterSubmit) {
    //       afterSubmit();
    //     }
    //   } else {
    //     toast.error(newFamily.message);
    //   }
    // } catch (err) {
    //   console.error(err);
    //   toast.error('Something went wrong!');
    // }
  }

  const membersArray = useFieldArray({
    name: 'members',
    control: form.control,
  });

  return <FamilyForm form={form} onSubmit={onSubmit} submitText="Create Family" membersArray={membersArray} />;
}
