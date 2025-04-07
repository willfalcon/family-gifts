'use client';

import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MemberFromGetFamily } from '@/lib/queries/families';
import { MoreHorizontal, Loader2 } from 'lucide-react';

import Link from 'next/link';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { removeMember } from '../actions';

type Props = {
  member: MemberFromGetFamily;
  isManager: boolean;
  memberIsManager: boolean;
  familyId: string;
};
export default function MemberMoreMenu({ member, isManager, memberIsManager, familyId }: Props) {
  const [removeOpen, setRemoveOpen] = useState(false);
  const queryClient = useQueryClient();
  const removeMutation = useMutation({
    mutationFn: () => removeMember(familyId, member.id),
    onSuccess: () => {
      setRemoveOpen(false);
      queryClient.invalidateQueries({ queryKey: ['family', familyId] });
      toast.success('Member removed');
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
  });
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/family-members/${member.id}`}>View Profile</Link>
          </DropdownMenuItem>
          {/* <DropdownMenuItem onClick={() => resendInvitationEmail(member.id)}>Resend Invitation Email</DropdownMenuItem> */}
          {/* TODO: implement */}
          {isManager && !memberIsManager && <DropdownMenuItem>Make Admin</DropdownMenuItem>}
          <DropdownMenuSeparator />
          {/* TODO: Implement */}
          {isManager && (
            <DropdownMenuItem className="text-destructive" onClick={() => setRemoveOpen(true)}>
              Remove Member
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <Button disabled={removeMutation.isPending} onClick={async () => await removeMutation.mutate()}>
              {removeMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Remove Member'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
