'use client';

import { Switch } from '@/components/ui/switch';
import { GetFamily } from '@/lib/queries/families';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useFamily } from '../../useFamily';
import { updateFamilyPrivacy } from '../actions';

type Props = {
  family: GetFamily;
};

export default function RequireApproval({ family: initialFamily }: Props) {
  const { data: family } = useFamily(initialFamily);
  const queryClient = useQueryClient();
  const { mutate: updateFamily, isPending } = useMutation({
    mutationFn: async () => {
      return await updateFamilyPrivacy(family.id, {
        requireApproval: !family.requireApproval,
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['family', data?.id], data);
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to update family settings.');
    },
  });
  return (
    <div className="flex items-center justify-between p-4 bg-muted rounded-md">
      <div>
        <h3 className="font-medium">Require Admin Approval</h3>
        <p className="text-sm text-muted-foreground">Require admin approval for new members not specifically invited.</p>
      </div>
      <Switch
        checked={family?.requireApproval}
        onCheckedChange={() => {
          updateFamily();
        }}
        disabled={isPending}
      />
    </div>
  );
}
