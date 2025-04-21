'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

import { GetFamily } from '@/lib/queries/families';
import { useFamily } from '../../useFamily';
import { approveJoinRequest, rejectJoinRequest } from '../actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function Approvals({ family: initialFamily }: { family: GetFamily }) {
  const { data: family, isLoading } = useFamily(initialFamily);
  const approvals = family?.invites.filter((invite) => invite.needsApproval);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>People who've tried to join and need approval.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <>
          {approvals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No pending approvals</p>
            </div>
          ) : (
            <div className="space-y-4">
              {approvals.map((invite) => (
                <Approval key={invite.id} invite={invite} />
              ))}
            </div>
          )}
        </>
      </CardContent>
    </Card>
  );
}

function Approval({ invite }: { invite: GetFamily['invites'][number] }) {
  const queryClient = useQueryClient();
  const { mutate: approve, isPending: isApproving } = useMutation({
    mutationFn: async () => {
      const updatedFamily = await approveJoinRequest(invite.id);
      return updatedFamily;
    },
    onSuccess: (updatedFamily) => {
      queryClient.setQueryData(['family', updatedFamily.id], updatedFamily);
      toast.success('Join request approved');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to approve join request', { description: error.message });
    },
  });

  const { mutate: reject, isPending: isRejecting } = useMutation({
    mutationFn: async () => {
      const updatedFamily = await rejectJoinRequest(invite.id);
      return updatedFamily;
    },
    onSuccess: (updatedFamily) => {
      queryClient.setQueryData(['family', updatedFamily.id], updatedFamily);
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to reject join request', { description: error.message });
    },
  });
  return (
    <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
      <div className="gap-4">
        <p className="font-medium">{invite.user?.name}</p>
        <p className="text-sm text-muted-foreground">{invite.user?.email}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground mr-4">
          <>Joined {formatDistanceToNow(invite.createdAt, { addSuffix: true })}</>
        </span>

        <Button variant="default" size="sm" onClick={() => approve()} disabled={isApproving}>
          {isApproving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Approving
            </>
          ) : (
            'Approve'
          )}
        </Button>
        <Button variant="secondary" size="sm" onClick={() => reject()} disabled={isRejecting}>
          {isRejecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Rejecting
            </>
          ) : (
            'Reject'
          )}
        </Button>
      </div>
    </div>
  );
}
