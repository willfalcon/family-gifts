import { formatDistanceToNow } from 'date-fns';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { GetFamily } from '@/lib/queries/families';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import InviteMembers from '../components/InviteMembers';
import CancelInvite from './CancelInvite';
import ResendInvite from './ResendInvite';

type Props = {
  family: GetFamily;
};

export default async function InvitationsTab({ family }: Props) {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in');
  }
  const isManager = family.managers.some((manager) => manager.id === session.user?.id);

  if (!isManager) {
    return;
  }

  return (
    <TabsContent value="invitations" className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Pending Invitations</CardTitle>
            <CardDescription>People you've invited to join your family</CardDescription>
          </div>
          <InviteMembers family={family} />
        </CardHeader>
        <CardContent>
          <>
            {family.invites.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No pending invitations</p>
              </div>
            ) : (
              <div className="space-y-4">
                {family.invites.map((invite) => (
                  <div key={invite.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <div className="flex items-center gap-4">
                      <p className="font-medium">{invite.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground mr-4">
                        <>Sent {formatDistanceToNow(invite.createdAt)}</>
                      </span>

                      <ResendInvite invite={invite} family={family} />

                      <CancelInvite invite={invite} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invitation Settings</CardTitle>
          <CardDescription>Manage how people can join your family</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <>
            <div className="flex items-center justify-between p-4 bg-muted rounded-md">
              <div>
                <h3 className="font-medium">Family Invitation Link</h3>
                <p className="text-sm text-muted-foreground">Share this link to invite people to your family</p>
              </div>
              <Button variant="outline">Generate Link</Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-md">
              <div>
                <h3 className="font-medium">Require Admin Approval</h3>
                <p className="text-sm text-muted-foreground">Require admin approval for new members</p>
              </div>
              <Button variant="outline">Enable</Button>
            </div>
          </>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
