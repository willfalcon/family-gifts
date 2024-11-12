import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Family } from '@prisma/client';
import { Check } from 'lucide-react';
import DeleteFamilyMember from './DeleteFamilyMember';
import { getMembers } from '@/lib/queries/family-members';
import ResendInvite from './ResendInvite';

type MembersListProps = { family: Family; isManager: boolean };

export default async function MembersList({ family, isManager = false }: MembersListProps) {
  const { success, members, message } = await getMembers(family.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Family Members</CardTitle>
      </CardHeader>
      <CardContent>
        {success ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Manager</TableHead>
                {isManager && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {members?.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.joined && <Check />}</TableCell>
                  <TableCell>{family.managerId === member.user?.id && <Check />}</TableCell>
                  {isManager && (
                    <TableCell>
                      <div className="flex space-x-2">
                        <ResendInvite {...member} />

                        <DeleteFamilyMember {...member} />
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>{message}</p>
        )}
      </CardContent>
    </Card>
  );
}
