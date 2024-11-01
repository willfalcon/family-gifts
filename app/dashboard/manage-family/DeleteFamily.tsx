'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Family } from "@prisma/client";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { useState } from "react";
import { deleteFamily } from "./actions";
import { toast } from "sonner";

type DeleteFamilyProps = {
  family: Family
}

export default function DeleteFamily({family}: DeleteFamilyProps) {

  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Family</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>Are you totally sure you want to delete the whole family?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{`No, don't delete`}</AlertDialogCancel>
          <AlertDialogAction onClick={async () => {
            try {
              const {success, message} = await deleteFamily(family);
              if (success) {
                toast.success('Family deleted.')
              } else {
                toast.error(message);
              }
            } catch(err) {
              console.error(err);
              toast.error('Somethign went wrong.');
            }
          }}>Delete the family</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}