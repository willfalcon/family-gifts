'use client';

import { Gift } from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useMe } from '@/hooks/use-me';
import { MemberFromDashboardGetFamilies } from '@/lib/queries/families';
import MessageDialog from './messages/MessageDialog';

type Props = {
  member: MemberFromDashboardGetFamilies;
  isManager: boolean;
};
export default function MemberCard({ member, isManager }: Props) {
  const { data: me } = useMe();

  const isSelf = me?.id === member.id;
  return (
    <Card key={member.id}>
      <CardHeader className="flex flex-row items-start space-y-0 pb-2">
        <div className="flex flex-1 items-center space-x-4">
          <Avatar>
            <AvatarImage src={member.image || undefined} alt={member.name || ''} />
            <AvatarFallback>
              {member.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">
              <Link href={`/dashboard/members/${member.id}`} className="hover:underline">
                {member.name}
              </Link>
            </CardTitle>
            <CardDescription className="text-xs">{member.email}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm">
          <Badge variant={isManager ? 'default' : 'secondary'} className="text-xs">
            {isManager ? 'Manager' : 'Member'}
          </Badge>
          <span className="text-muted-foreground text-xs">{member._count.lists} wish lists</span>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 p-2">
        {me?.id && !isSelf && <MessageDialog user={me.id} dmId={member.id} className="align-start" />}

        <Button variant="ghost" size="sm" asChild className="col-start-2 self-end">
          <Link href={`/dashboard/wish-lists/${member.id}`}>
            <Gift className="h-4 w-4 mr-1" />
            Lists
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
