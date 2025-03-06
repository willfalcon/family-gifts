import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FamilyMemberWithUser } from "@/prisma/types";
import { FamilyMember } from "@prisma/client";
import { Dispatch, SetStateAction, TransitionStartFunction } from "react";
import { demoteMember } from "./actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Props = {
  member: FamilyMember;
  setMembers: Dispatch<SetStateAction<FamilyMemberWithUser[]>>;
  startTransition: TransitionStartFunction;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DemoteMember({member, setMembers, startTransition, open, setOpen}: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Demote Family Member</DialogTitle>
          <DialogDescription>Are you sure you want to make {member.name} not a manager anymore?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              try {
                startTransition(async () => {
                  const { success, message, members } = await demoteMember(member);
                  if (success && members) {
                    setMembers(members);
                    toast.success('Member demoted');
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
            Demote
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}