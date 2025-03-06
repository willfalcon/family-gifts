'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { FamilyMember } from '@prisma/client';
import { Trash2 } from 'lucide-react';
import { Dispatch, SetStateAction, TransitionStartFunction, useState } from 'react';
import { toast } from 'sonner';


import { deleteMember } from '@/app/dashboard/manage-family/actions';
import { FamilyMemberWithUser } from '@/prisma/types';

type Props = {
  member: FamilyMember;
  setMembers: Dispatch<SetStateAction<FamilyMemberWithUser[]>>;
  startTransition: TransitionStartFunction;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DeleteFamilyMember({member, setMembers, startTransition, open, setOpen}: Props) { 
  const [assignmentsAlert, setAssignmentsAlert] = useState(false);
  return (
    <>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Family Member</AlertDialogTitle>
              <AlertDialogDescription>Are you sure you want to remove {member.name} as a family member?</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  try {
                    startTransition(async () => {
                      const { success, message, events } = await deleteMember(member);
                      if (success) {
                        setMembers((prevMembers) => {
                          return prevMembers.filter(m => m.id !== member.id);
                        })
                        toast.success('Member deleted');
                      } else if (events) {
                        setAssignmentsAlert(true);
                      } else {
                        toast.error(message);
                      }
                    })
                  } catch (err) {
                    console.error(err);
                    toast.error('Something went wrong');
                  }
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={assignmentsAlert} onOpenChange={setAssignmentsAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hold up!</AlertDialogTitle>
              <AlertDialogDescription>There are upcoming events where this user has been assigned in secret santa. If you continue, we&apos;ll have to clear out those assignments and you&apos;ll have to redo it.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={async () => {
                try {
                    const { success, message } = await deleteMember(member, true);
                    if (success) {
                      toast.success('Member deleted');
                      setAssignmentsAlert(false);
                    } else {
                      toast.error(message);
                    }
                  } catch (err) {
                    console.error(err);
                    toast.error('Something went wrong');
                  }
              }}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
  );
}
