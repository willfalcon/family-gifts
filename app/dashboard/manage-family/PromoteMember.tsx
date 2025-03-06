import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FamilyMemberWithUser } from "@/prisma/types";
import { FamilyMember } from "@prisma/client";
import { ShieldCheck } from "lucide-react";
import { Dispatch, SetStateAction, TransitionStartFunction, useEffect, useState } from "react";
import { promoteMember } from "./actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Props = {
  member: FamilyMember;
  setMembers: Dispatch<SetStateAction<FamilyMemberWithUser[]>>;
  startTransition: TransitionStartFunction;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function PromoteMember({member, setMembers, startTransition, open, setOpen}: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Promote Family Member</DialogTitle>
          <DialogDescription>Are you sure you want to make {member.name} to a family manager?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              try {
                startTransition(async () => {
                  const { success, message, members } = await promoteMember(member);
                  if (success && members) {
                    setMembers(members);
                    toast.success('Member promoted');
                    setOpen(false);
                  } else {
                    toast.error(message);
                  }
                });
              } catch (err) {
                console.error(err);
                toast.error('Something went wrong');
              }
            }}
          >
            Promote
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}