import { User } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { GetFamily } from '@/lib/queries/families';
import { transferFamily } from '../../actions';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Transfer({ family }: { family: GetFamily }) {
  const [open, setOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User['id'] | undefined>(undefined);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      if (selectedMember) {
        await transferFamily(family.id, selectedMember);
      }
    },
    onSuccess: (data) => {
      toast.success('Family transferred');
      queryClient.setQueryData(['family', family.id], data);
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10">
          Transfer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Ownership</DialogTitle>
        </DialogHeader>
        <DialogDescription>Transfer ownership of this family to another member</DialogDescription>
        <Select value={selectedMember} onValueChange={(value) => setSelectedMember(value)}>
          <SelectTrigger>
            <SelectValue placeholder={'Select a member to transfer to'} />
          </SelectTrigger>
          <SelectContent>
            {family.members.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          This will also make the new owner a manager of the family if they're not already. You will remain a manager.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button disabled={mutation.isPending} onClick={() => mutation.mutate()}>
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Transferring...
              </>
            ) : (
              'Transfer'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
