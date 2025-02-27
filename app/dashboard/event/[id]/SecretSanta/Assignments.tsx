// import { FamilyMember } from '@prisma/client';
// import { Dispatch, SetStateAction } from 'react';
// import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSecretSantaStore } from './SecretSantaStoreProvider';
import { Button } from '@/components/ui/button';
import { saveAssignments } from '../actions';
import { toast } from 'sonner';
import ResendEmail from './ResendEmail';

// import { toast } from 'sonner';
// import { createAssignments } from '@/app/dashboard/secret-santa/actions';
// import { Exclusion } from './Exclusions';

// export type AssignmentsType = FamilyMember[];

export default function Assignments({ eventId, isManager = false }: { eventId: string; isManager?: boolean }) {
  const assignmentsList = useSecretSantaStore((state) => state.assignments);
  // const participating = useSecretSantaStore((state) => state.participating);
  const generated = useSecretSantaStore((state) => state.generated);
  const setGenerated = useSecretSantaStore((state) => state.setGenerated);
  const setSaved = useSecretSantaStore((state) => state.setSaved);
  const saved = useSecretSantaStore((state) => state.saved);

  return (
    <>
      {Object.keys(assignmentsList).length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Secret Santa Assignments</CardTitle>
            <CardDescription>Here are the generated Secret Santa assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Giver</TableHead>
                  <TableHead>Recipient</TableHead>
                  {isManager && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignmentsList.map(({ giver, receiver }) => {
                  return (
                    <TableRow key={giver.id}>
                      <TableCell>{giver.name}</TableCell>
                      <TableCell>{receiver.name}</TableCell>
                      {isManager && (
                        <TableCell>
                          <ResendEmail giver={giver} receiver={receiver} eventId={eventId} />
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {generated && (
              <Button
                onClick={async () => {
                  try {
                    const event = await saveAssignments(eventId, assignmentsList);
                    if (event.success) {
                      toast.success('Assignments saved');
                      setSaved(true);
                      setGenerated(false);
                    } else {
                      toast.warning(event.message);
                    }
                  } catch (err) {
                    console.error(err);
                    toast.error('Error saving assignments');
                  }
                }}
              >
                Save Assignments
              </Button>
            )}
            {saved && (
              <Button
                onClick={async () => {
                  // await sendEmails();
                }}
              >
                Send Emails
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
