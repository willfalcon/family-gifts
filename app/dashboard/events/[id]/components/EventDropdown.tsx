'use client';
import { ArrowLeft, CalendarDays, Clock, Edit, Gift, MapPin, MoreHorizontal, Share2, Users } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import { EventFromGetEvent } from '@/lib/queries/events';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { deleteEvent } from '@/app/dashboard/events/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type Props = {
  isManager: boolean;
  event: EventFromGetEvent;
};

export default function EventDropdown({ isManager, event }: Props) {
  const router = useRouter();
  const [cancelOpen, setCancelOpen] = useState(false);
  async function cancelEvent() {
    try {
      await deleteEvent(event.id);
      toast.success('Event cancelled');
      router.push('/dashboard/events');
    } catch (error) {
      toast.error('Failed to cancel event');
    }
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Add to Calendar</DropdownMenuItem>
          <DropdownMenuItem>Send Reminder</DropdownMenuItem>
          {isManager && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => setCancelOpen(true)}>
                Cancel Event
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>This action cannot be undone. This will cancel the event and notify all participants.</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Nevermind</AlertDialogCancel>
            <AlertDialogAction onClick={cancelEvent}>Cancel Event</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
