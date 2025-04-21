'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

import { GetFamily } from '@/lib/queries/families';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TabsContent, useTabs } from '@/components/ui/tabs';
import { useFamily } from '../../useFamily';
import InviteMembers from '../components/InviteMembers';
import MemberListItem from './MemberListItem';

type Props = {
  isManager: boolean;
  family: GetFamily;
};

export default function MembersTab({ isManager, family: initialFamily }: Props) {
  const { data: family } = useFamily(initialFamily);
  const { members, managers } = family;
  const { setValue } = useTabs();
  const [searchTerm, setSearchTerm] = useState('');
  // TODO: Smarter search
  const filteredMembers = members.filter((member) => member.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  return (
    <TabsContent value="members" className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <>
            <div>
              <CardTitle>Family Members</CardTitle>
              <CardDescription>People in your family group</CardDescription>
            </div>

            {isManager && <InviteMembers family={family} />}
          </>
        </CardHeader>
        <CardContent>
          <>
            <div className="relative w-full mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search members..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Email</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Role</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Wish Lists</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member) => {
                      const memberIsManager = managers.some((manager) => manager.id === member.id);
                      const invite = family.invites.find((invite) => invite.userId === member.id);
                      const needsApproval = invite?.needsApproval;
                      return (
                        <MemberListItem
                          key={member.id}
                          member={member}
                          isManager={isManager}
                          memberIsManager={memberIsManager}
                          familyId={family.id}
                          needsApproval={needsApproval}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        </CardContent>
        <CardFooter>
          {isManager && (
            <Button variant="ghost" className="text-sm text-muted-foreground" onClick={() => setValue('invitations')}>
              {family.invites.length} pending invitation{family.invites.length === 1 ? '' : 's'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </TabsContent>
  );
}
