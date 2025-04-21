'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GetFamily } from '@/lib/queries/families';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isBefore } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useFamily } from '../../useFamily';
import { generateInviteLink } from '../actions';

type Props = {
  family: GetFamily;
};
export default function InvitationLink({ family: initialFamily }: Props) {
  const { data: family } = useFamily(initialFamily);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const updatedFamily = await generateInviteLink(family.id);
      return updatedFamily;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['family', family.id], data);
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to generate invite link');
    },
  });

  const invitationLink =
    family?.inviteLinkToken &&
    family?.inviteLinkExpiry &&
    isBefore(new Date(), new Date(family.inviteLinkExpiry)) &&
    `${process.env.NEXT_PUBLIC_FRONTEND_URL}/family-invite/${family.inviteLinkToken}`;

  return (
    <div className="flex flex-col p-4 bg-muted rounded-md gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Family Invitation Link</h3>
          <p className="text-sm text-muted-foreground">Share this link to invite people to your family</p>
        </div>
        <Button variant="outline" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : invitationLink ? (
            'Regenerate Link'
          ) : (
            'Generate Link'
          )}
        </Button>
      </div>
      {invitationLink && (
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <Input value={invitationLink} readOnly className="font-mono text-sm bg-background" />
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                navigator.clipboard.writeText(invitationLink);
                toast('Link copied!', {
                  description: 'The invitation link has been copied to your clipboard.',
                });
              }}
            >
              Copy
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">This link will expire in 7 days. Anyone with this link can join your family.</p>
        </div>
      )}
    </div>
  );
}
