'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Dispatch, SetStateAction } from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { FamilyMemberWithUser } from '@/prisma/types';
import { resendInviteEmail } from "@/app/dashboard/manage-family/actions";

type Props = {
  member: FamilyMemberWithUser;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
export default function ResendInvite({member, open, setOpen}: Props) {
  // TODO: make this do something
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resend Invite Email</DialogTitle>
          <DialogDescription>Are you sure you want to resend the invite email to {member.email}?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              try {
                setOpen(false);
                const result = await resendInviteEmail(member)
                if (result.success) {
                  toast.success('Invite email resent');
                } else {
                  console.error(result);
                  toast.error('Failed to resend invite email');
                }
              } catch (err) {
                console.error(err);
                toast.error('Something went wrong');
              }
            }}
          >
            Resend
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
