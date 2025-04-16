'use client';

import { GetFamily } from '@/lib/queries/families';
import { useFamily } from '../../../useFamily';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MemberListItem from './MemberListItem';

type Props = {
  family: GetFamily;
  userId: string;
};

export default function EditFamilyMembers({ family: initialFamily, userId }: Props) {
  const { data: family } = useFamily(initialFamily);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Members</CardTitle>
        <CardDescription>Change roles or remove members from your family</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Email</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Role</th>
                  <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {family.members.map((member) => {
                  const isManager = family.managers.some((m) => m.id === member.id);
                  return <MemberListItem key={member.id} member={member} isManager={isManager} familyId={family.id} isSelf={member.id === userId} />;
                })}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
