'use client';

import { EventFromGetEvent } from '@/lib/queries/events';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Setup from './components/Setup';
import Participants from './components/Participants';
import Exclusions from './components/Exclusions';
import Review from './components/Review';
import { Button } from '@/components/ui/button';
import { useEffect, createContext, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { updateSecretSanta } from './actions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useSecretSantaStore } from './store';
type Props = {
  event: EventFromGetEvent;
};

export default function SecretSanta({ event }: Props) {
  const [tab, setTab] = useState('setup');

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
      <Tabs value={tab} onValueChange={setTab} className={cn(mutation.isPending && 'opacity-50')}>
        <TabsList>
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="exclusions">Exclusions</TabsTrigger>
          <TabsTrigger value="review">Review & Send</TabsTrigger>
        </TabsList>
        <TabsContent value="setup" className="space-y-6">
          <Setup event={event} onNext={() => setTab('participants')} />
        </TabsContent>
        <TabsContent value="participants" className="space-y-6">
          <Participants event={event} onNext={() => setTab('exclusions')} onPrevious={() => setTab('setup')} />
        </TabsContent>
        <TabsContent value="exclusions" className="space-y-6">
          <Exclusions onNext={() => setTab('review')} onPrevious={() => setTab('participants')} />
        </TabsContent>
        <TabsContent value="review" className="space-y-6">
          <Review event={event} onPrevious={() => setTab('exclusions')} />
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
