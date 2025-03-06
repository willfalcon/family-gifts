'use client';

import { useForm } from 'react-hook-form';
import { FamilyMemberSchema, FamilyMemberSchemaType } from './familyMemberSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { getDefaults } from '@/lib/utils';
import { createFamilyMember } from './actions';
import { Family } from '@prisma/client';
import { toast } from 'sonner';
import MemberForm from './MemberForm';
import { Dispatch, SetStateAction, TransitionStartFunction } from 'react';
import { FamilyMemberWithUser } from '@/prisma/types';

type Props = {
  family: Family;
  startTransition: TransitionStartFunction;
  setMembers: Dispatch<SetStateAction<FamilyMemberWithUser[]>>;
};
export default function AddMember({ family, startTransition, setMembers }: Props) {
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

      startTransition(async () => {
        const { success, message, member } = await createFamilyMember(data);
        if (success && member) {
          toast.success('Added member!');
          setMembers((prevMembers) => {
            return [...prevMembers, member];
          })
          form.reset();
        } else {
          toast.error(message);
        }
      })
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong.');
    }
  }

  return <MemberForm form={form} onSubmit={onSubmit} submitText="+ Add Member" />;
}
