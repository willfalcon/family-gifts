import { FamilyMember } from '@prisma/client';
import { AssignmentsType, Exclusion } from './Manager';
import { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

type AssignmentsProps = {
  participating: FamilyMember[];
  exclusions: Exclusion[];
  assignmentsList: AssignmentsType[];
  setAssignments: Dispatch<SetStateAction<AssignmentsType[]>>;
};
export default function Assignments({ assignmentsList, participating, exclusions, setAssignments }: AssignmentsProps) {
  const generateAssignments = () => {
    const availableRecipients = [...participating];
    // const newAssignments: { [key: string]: FamilyMember } = {};
    let newAssignments: AssignmentsType[] = [];

    for (const giver of participating) {
      const possibleRecipients = availableRecipients.filter(
        (recipient) => recipient.id !== giver.id && !exclusions.some((e) => e.giver.id === giver.id && e.excluded.id === recipient.id),
      );

      if (possibleRecipients.length === 0) {
        toast.error('Unable to generate assignments. Make sure you have at least 2 participants and that your exclusions make sense.');
        return;
      }

      const recipientIndex = Math.floor(Math.random() * possibleRecipients.length);
      const recipient = possibleRecipients[recipientIndex];

      newAssignments = [...newAssignments, [giver, recipient]];
      availableRecipients.splice(
        availableRecipients.findIndex((usedRecipient) => usedRecipient.id === recipient.id),
        1,
      );
    }

    setAssignments(newAssignments);
  };
  return (
    <>
      <Button onClick={generateAssignments}>Generate Assignments</Button>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignmentsList.map(([giver, recipient]) => (
                  <TableRow key={giver.id}>
                    <TableCell>{participating.find((m) => m.id === giver.id)?.name}</TableCell>
                    <TableCell>{participating.find((m) => m.id === recipient.id)?.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
}
