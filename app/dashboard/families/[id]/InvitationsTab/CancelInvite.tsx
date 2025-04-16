'use client';

import { Invite } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { cancelInvite } from '../actions';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export default function CancelInvite({ invite }: { invite: Invite }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      await cancelInvite(invite.id);
    },
    onSuccess: () => {
      setOpen(false);
      toast.success('Invite cancelled', { description: 'Wow. What did they do?' });
      queryClient.invalidateQueries({ queryKey: ['family', invite.familyId] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Cancel
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          This will cancel the invitation. Could cause confusion if the user tries to join later, but hey, you gotta do what you gotta do.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Don't Cancel Invite</AlertDialogCancel>
          <Button variant="destructive" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Cancelling...
              </>
            ) : (
              'Cancel Invite'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
