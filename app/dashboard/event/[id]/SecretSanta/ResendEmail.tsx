import { Mail } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { sendSecretSantaEmail } from '../actions';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FamilyMember } from '@prisma/client';
import { useState } from 'react';

type ResendEmailProps = {
  giver: FamilyMember;
  receiver: FamilyMember;
  eventId: string;
};
export default function ResendEmail({ giver, receiver, eventId }: ResendEmailProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button title="Resend Email" variant="ghost" size="icon">
          <Mail />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resend Email</DialogTitle>
          <DialogDescription>Are you sure you want to resend the email to {giver.name}?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={async () => {
              try {
                const emailSent = await sendSecretSantaEmail(giver, receiver, eventId);
                if (emailSent.success) {
                  toast.success('Email sent');
                  setOpen(false);
                } else {
                  console.error(emailSent.error);
                  toast.error(emailSent.message);
                }
              } catch (err) {
                console.error(err);
                toast.error('Error sending email');
              }
            }}
          >
            Send
          </Button>
          <DialogClose>Cancel</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
