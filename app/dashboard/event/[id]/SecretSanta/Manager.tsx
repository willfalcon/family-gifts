'use client';
import Participants from './Participants';
import { useQuery } from '@tanstack/react-query';
import { getMembers } from '../actions';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorMessage } from '@/components/ErrorMessage';
import Exclusions from './Exclusions';
import Assignments from './Assignments';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useSecretSantaStore } from './SecretSantaStoreProvider';

type Props = {
  familyId: string;
  eventId: string;
};

export default function Manager({ familyId, eventId }: Props) {
  const { data, isPending, error } = useQuery({ queryKey: ['members', familyId], queryFn: () => getMembers(familyId) });

  const assignments = useSecretSantaStore((state) => state.assignments);
  const generateAssignments = useSecretSantaStore((state) => state.generateAssignments);

  if (isPending) {
    return <Skeleton />;
  }

  if (error) {
    return (
      <ErrorMessage title="Something went wrong.">
        <pre>
          <code>{error.message}</code>
        </pre>
      </ErrorMessage>
    );
  }

  const { members, success, message } = data;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Manage Secret Santa</Button>
      </DialogTrigger>
      <DialogContent className="w-[700px] max-w-full pr-10">
        <DialogHeader>
          <DialogTitle>Secret Santa Manager</DialogTitle>
          <DialogDescription>Select participants and set exclusions for Secret Santa</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] pr-5">
          {success ? (
            <>
              {members?.length ? (
                <>
                  <Participants members={members} />
                  <Exclusions />
                  <Button onClick={generateAssignments}>{assignments?.length && `Regenerate `}Assignments</Button>
                  <Assignments eventId={eventId} />
                </>
              ) : (
                <p>Add members to set up secret santa.</p>
              )}
            </>
          ) : (
            <p>{message}</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
