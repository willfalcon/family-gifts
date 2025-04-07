'use client';

import { Mail } from 'lucide-react';
import { sendInviteEmail } from '@/app/dashboard/families/new/actions';
import { Invite, Family } from '@prisma/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function ResendInvite({ invite, family }: { invite: Invite; family: Family }) {
  const [sending, setSending] = useState(false);
  async function resendInvite() {
    setSending(true);
    try {
      await sendInviteEmail(invite, family);
      toast.success('Invite resent');
      setSending(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to resend invite');
      setSending(false);
    }
  }
  return (
    <Button size="sm" variant="outline" onClick={() => resendInvite()} disabled={sending}>
      <>
        <Mail className="h-4 w-4 mr-2" />
        {sending ? 'Resending...' : 'Resend'}
      </>
    </Button>
  );
}
