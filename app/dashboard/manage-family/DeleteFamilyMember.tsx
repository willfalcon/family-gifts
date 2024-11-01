'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { FamilyMember } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteMember } from "./actions";

export default function DeleteFamilyMember(member: FamilyMember) {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" aria-label={`Remove ${member.name} from family`}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Family Member</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to remove {member.name} as a family member?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={async () => {
            try {
              const {success, message} = await deleteMember(member);
              if (success) {
                toast.success('Member deleted');
              } else {
                toast.error(message)
              }
            } catch(err) {
              console.error(err);
              toast.error('Something went wrong');
            }
          }}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}