'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { GetFamily } from '@/lib/queries/families';
import { cn } from '@/lib/utils';

import { inviteMembers } from '../actions';
import { InvitesSchema, InvitesSchemaType } from '../inviteSchema';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type Props = {
  family: GetFamily;
};

export default function InviteMembers({ family }: Props) {
  const [open, setOpen] = useState(false);
  const form = useForm<InvitesSchemaType>({
    resolver: zodResolver(InvitesSchema),
    defaultValues: {
      invites: [{ value: '' }],
    },
  });

  const invitesArray = useFieldArray({
    name: 'invites',
    control: form.control,
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    async mutationFn(values: InvitesSchemaType) {
      const members = await inviteMembers(family.id, values);
      return members;
    },
    onSuccess(res) {
      queryClient.invalidateQueries({ queryKey: ['family', family.id] });
      toast.success(`Invites sent!`);
      console.log(res);
      setOpen(false);
    },
    onError(error) {
      console.error(error);
      toast.error(error.message);
    },
  });

  async function onSubmit(values: InvitesSchemaType) {
    mutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite new members.</DialogTitle>
          <DialogDescription>Add emails to send invites to. You can also resend or cancel pending invites here.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-4', mutation.isPending && 'opacity-60 pointer-events-none')}>
            {invitesArray.fields.map((field, index) => (
              <FormField
                control={form.control}
                key={field.id}
                name={`invites.${index}.value`}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className={cn(index !== 0 && 'sr-only')}>Invite Members</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Email Address" />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
            ))}
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="mt-1 rounded-full w-7 h-7 col-start-2"
              onClick={() => invitesArray.append({ value: '' })}
              aria-label="Add Member"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <br />
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Inviting...
                </>
              ) : (
                'Invite'
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
