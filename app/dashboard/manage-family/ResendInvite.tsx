'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FamilyMember } from '@prisma/client';
import { Mail } from 'lucide-react';

export default function ResendInvite(member: FamilyMember) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm" aria-label={`Resend invite to ${member.name}`}>
            <Mail className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Resend invite</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
