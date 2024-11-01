'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Item } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteItem } from "./actions";
import { toast } from "sonner";

export default function ItemDelete({id}: {id: Item['id']}) {
  const [open, setOpen] = useState(false);
  async function onDelete() {
    try {
      const res = await deleteItem(id);
      if (res.success) {
        toast.success('Deleted!')
      } else {
        toast.warning(res.message);
      }
      setOpen(false);
    } catch {
      toast.warning('Something went wrong.');
      setOpen(false);
    }
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="destructive">
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Item</AlertDialogTitle>
          <AlertDialogDescription>Are you sure?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}