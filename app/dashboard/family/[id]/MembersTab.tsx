import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { TabsContent } from '@/components/ui/tabs';
import { FamilyFromGetFamily } from '@/lib/queries/families';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Search, Gift, Mail, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import InviteMembers from './InviteMembers';

type Props = {
  isManager: boolean;
  family: FamilyFromGetFamily;
};

export default function MembersTab({ isManager, family }: Props) {
  const { members, managers } = family;
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
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">More</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/family-members/${member.id}`}>View Profile</Link>
                                  </DropdownMenuItem>
                                  {/* TODO: implement */}
                                  {isManager && !memberIsManager && <DropdownMenuItem>Make Admin</DropdownMenuItem>}
                                  <DropdownMenuSeparator />
                                  {/* TODO: Implement */}
                                  {isManager && <DropdownMenuItem className="text-destructive">Remove from Family</DropdownMenuItem>}
                                </DropdownMenuContent>
                              </DropdownMenu>
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
