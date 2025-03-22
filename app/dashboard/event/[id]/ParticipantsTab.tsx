import { TabsContent } from '@/components/ui/tabs';
import { EventForEventPage } from './page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FamilyWithManagers } from '@/prisma/types';
import { Prisma } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Props = {
  family: Prisma.FamilyGetPayload<{
    include: {
      members: {
        include: {
          user: true;
        };
      };
      managers: true;
    };
  }>;
};

export default function ParticipantsTab({ family }: Props) {
  return (
    <TabsContent value="participants" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Participants</CardTitle>
          <CardDescription>People invited to this event</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {family.members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.user?.image || undefined} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                {/* <Badge variant={member.attending === 'yes' ? 'default' : member.attending === 'maybe' ? 'outline' : 'secondary'}>
                  {member.attending === 'yes' ? 'Attending' : member.attending === 'maybe' ? 'Maybe' : 'Not Attending'}
                </Badge> */}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
