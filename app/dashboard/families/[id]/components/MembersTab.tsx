'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Input } from '@/components/ui/input';
import { TabsContent } from '@/components/ui/tabs';
import { GetFamily } from '@/lib/queries/families';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Search, Gift, Mail } from 'lucide-react';
import Link from 'next/link';
import InviteMembers from './InviteMembers';

import MemberMoreMenu from './MemberMoreMenu';
import { useQuery } from '@tanstack/react-query';
import { getFamily } from '../actions';

type Props = {
  isManager: boolean;
  family: GetFamily;
};

export default function MembersTab({ isManager, family }: Props) {
  const query = useQuery({
    queryKey: ['family', family.id],
    queryFn: () => getFamily(family.id),
    initialData: family,
  });
  const { members, managers } = query.data;
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
              <Input type="search" placeholder="Search members..." className="w-full pl-8" />
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
                    {members.map((member) => {
                      const memberIsManager = managers.some((manager) => manager.id === member.id);
                      return (
                        <tr key={member.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={member.image || undefined} alt={member.name || ''} />
                                <AvatarFallback>
                                  {member.name
                                    ?.split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                                </AvatarFallback>
                              </Avatar>
                              <Link href={`/dashboard/family-members/${member.id}`} className="font-medium hover:underline">
                                {member.name}
                              </Link>
                            </div>
                          </td>
                          <td className="p-4 align-middle">{member.email}</td>
                          <td className="p-4 align-middle">
                            <Badge variant={memberIsManager ? 'default' : 'secondary'}>{memberIsManager ? 'Manager' : 'Member'}</Badge>
                          </td>
                          <td className="p-4 align-middle">{member._count.lists}</td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Mail className="h-4 w-4" />
                                <span className="sr-only">Message</span>
                              </Button>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/dashboard/wish-lists?member=${member.id}`}>
                                  <>
                                    <Gift className="h-4 w-4" />
                                    <span className="sr-only">View Wish Lists</span>
                                  </>
                                </Link>
                              </Button>
                              <MemberMoreMenu member={member} isManager={isManager} memberIsManager={memberIsManager} familyId={family.id} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
