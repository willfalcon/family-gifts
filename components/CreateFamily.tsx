'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import NewFamily from '@/app/dashboard/manage-family/NewFamily';

export default function CreateFamily({
  variant = 'ghost',
}: {
  variant?: 'link' | 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | null | undefined;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} className="px-2 font-bold text-2xl">
          Create a Family
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create a Family</DialogTitle>
        </DialogHeader>
        <NewFamily afterSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
