'use client';

import { useMutation } from '@tanstack/react-query';
import { Info, Loader2, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { GetFamily } from '@/lib/queries/families';
import { deleteFamily } from '../../actions';

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
import RemoveSelf from './RemoveSelf';
import Transfer from './Transfer';

export default function DangerZone({ family }: { family: GetFamily }) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const router = useRouter();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await deleteFamily(family.id);
      router.push('/dashboard/families');
    },
    onSuccess: () => {
      toast.success('Family deleted');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to delete family');
    },
  });
  return (
    <Card className="border-destructive/50">
      <CardHeader className="text-destructive">
        <CardTitle>Danger Zone</CardTitle>
        <CardDescription>Irreversible actions that affect your family</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border border-destructive/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Delete Family</h3>
              <p className="text-sm text-muted-foreground">Permanently delete this family and all associated data</p>
            </div>
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Family</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the
                    <span className="font-bold"> {family.name}</span> family and remove all associated data.
                    <div className="mt-4 rounded-md bg-destructive/10 p-3 text-destructive">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        <span className="font-medium">Warning</span>
                      </div>
                      <p className="mt-2 text-sm">
                        This will delete all family events, wish lists, and member associations. Members will lose access to shared content.
                      </p>
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
                        Delete Family
                      </>
                    )}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="rounded-md border border-destructive/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Transfer Ownership</h3>
              <p className="text-sm text-muted-foreground">Transfer ownership of this family to another member</p>
            </div>
            <Transfer family={family} />
          </div>
        </div>

        <div className="rounded-md border border-destructive/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Leave Family</h3>
              <p className="text-sm text-muted-foreground">Remove yourself from this family</p>
            </div>
            <RemoveSelf
              family={family}
              trigger={
                <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10">
                  Leave Family
                </Button>
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
