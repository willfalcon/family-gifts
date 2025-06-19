'use client';

import { useMutation } from '@tanstack/react-query';
import { Info, Loader2, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { type GetListForEdit } from '@/lib/queries/items';
import { deleteList } from './actions';

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  list: GetListForEdit;
};

export default function DeleteList({ list }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await deleteList(list.id);
    },
    onSuccess: () => {
      router.push('/dashboard/wish-lists');
      toast.success('List deleted');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to delete list');
    },
  });

  return (
    <Card className="border-destructive/50">
      <CardHeader className="text-destructive">
        <CardTitle>Delete List</CardTitle>
        <CardDescription>Delete this list and all associated items.</CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete List</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="text-sm text-muted-foreground">
                  This action cannot be undone. This will permanently delete
                  <span className="font-bold"> {list.name}</span> and all its items.
                  <div className="mt-4 rounded-md bg-destructive/10 p-3 text-destructive">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      <span className="font-medium">Warning</span>
                    </div>
                    <p className="mt-2 text-sm">This will delete all items on the list and remove all associated data.</p>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                onClick={() => {
                  deleteMutation.mutate();
                }}
                disabled={deleteMutation.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete List
                  </>
                )}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
