'use client';

import { useForm } from 'react-hook-form';
import { FamilyMemberSchema, FamilyMemberSchemaType } from './familyMemberSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { getDefaults } from '@/lib/utils';
import { createFamilyMember } from './actions';
import { Family } from '@prisma/client';
import { toast } from 'sonner';
import MemberForm from './MemberForm';

type Props = {
  family: Family;
};
export default function AddMember({ family }: Props) {
  const form = useForm<FamilyMemberSchemaType>({
    resolver: zodResolver(FamilyMemberSchema),
    defaultValues: getDefaults(FamilyMemberSchema),
  });

  async function onSubmit(values: FamilyMemberSchemaType) {
    try {
      const data = {
        ...values,
        family,
      };

      const { success, message } = await createFamilyMember(data);
      if (success) {
        toast.success('Added member!');
        form.reset();
      } else {
        toast.error(message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong.');
    }
  }

  return <MemberForm form={form} onSubmit={onSubmit} submitText="+ Add Member" />;
}
