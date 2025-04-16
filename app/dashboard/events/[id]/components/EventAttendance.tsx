'use client';

import { EventResponse, Invite } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, HelpCircle, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { getEventAttendance, updateEventAttendance } from '../actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function EventAttendance({ invite }: { invite: Invite }) {
  const { data: response, isFetching } = useQuery({
    queryKey: ['event-attendance', invite.id],
    queryFn: async () => {
      const response = await getEventAttendance(invite.id);
      return response;
    },
  });
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (response: EventResponse) => {
      await updateEventAttendance(invite.id, response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-attendance', invite.id] });
      queryClient.invalidateQueries({ queryKey: ['participant', invite.id] });
    },
  });
  const pending = isFetching || mutation.isPending;
  return (
    <Card className="flex flex-col md:flex-row justify-between items-center">
      <CardHeader>
        <CardTitle>Attendance</CardTitle>
        <CardDescription className="text-pretty">Let everyone know if you&apos;ll be attending this event.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={pending}
                  variant={pending ? 'ghost' : response === 'accepted' ? 'default' : 'outline'}
                  onClick={() => mutation.mutate('accepted')}
                  className={cn(response === 'accepted' && 'bg-green-600', 'hover:bg-green-600 hover:text-white group')}
                >
                  <Check className={cn(`w-4 h-4 group-hover:text-white`, response === 'accepted' ? 'text-white' : 'text-green-600')} />
                  Attending
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>I'll be attending.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={pending}
                  variant={pending ? 'ghost' : response === 'maybe' ? 'default' : 'outline'}
                  onClick={() => mutation.mutate('maybe')}
                  className={cn(response === 'maybe' && 'bg-yellow-500', 'hover:bg-yellow-500 hover:text-white group')}
                >
                  <HelpCircle className={cn(`w-4 h-4 group-hover:text-white`, response === 'maybe' ? 'text-white' : 'text-yellow-500')} />
                  Maybe
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>I'm not sure if I'll be attending.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={pending}
                  variant={pending ? 'ghost' : response === 'declined' ? 'default' : 'outline'}
                  onClick={() => mutation.mutate('declined')}
                  className={cn(response === 'declined' && 'bg-red-600', 'hover:bg-red-600 hover:text-white group')}
                >
                  <X className={cn(`w-4 h-4 group-hover:text-white`, response === 'declined' ? 'text-white' : 'text-red-600')} />
                  Not Attending
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>I'm not attending.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
