'use client';

import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { EventFromGetEvent } from '@/lib/queries/events';
import { cn } from '@/lib/utils';
import { updateSecretSanta } from './actions';
import { useSecretSantaStore } from './store';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Exclusions from './components/Exclusions';
import Participants from './components/Participants';
import Review from './components/Review';
import Setup from './components/Setup';
type Props = {
  event: EventFromGetEvent;
};

export default function SecretSanta({ event }: Props) {
  const { assignments, exclusions, initializeStore } = useSecretSantaStore();
  useEffect(() => {
    initializeStore(event);
  }, [event]);
  const mutation = useMutation({
    mutationFn: async () => {
      await updateSecretSanta(event.id, assignments, exclusions);
    },
    onSuccess: () => {
      toast.success('Secret Santa assignments updated successfully');
    },
    onError: () => {
      toast.error('Failed to update Secret Santa assignments');
    },
  });

  return (
    <>
      <Tabs defaultValue="setup" className={cn(mutation.isPending && 'opacity-50')}>
        <TabsList>
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="exclusions">Exclusions</TabsTrigger>
          <TabsTrigger value="review">Review & Send</TabsTrigger>
        </TabsList>
        <TabsContent value="setup" className="space-y-6">
          <Setup event={event} />
        </TabsContent>
        <TabsContent value="participants" className="space-y-6">
          <Participants event={event} />
        </TabsContent>
        <TabsContent value="exclusions" className="space-y-6">
          <Exclusions />
        </TabsContent>
        <TabsContent value="review" className="space-y-6">
          <Review event={event} />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-6">
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </>
  );
}
