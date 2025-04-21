import { formatDistanceToNow } from 'date-fns';

import { GetFamily } from '@/lib/queries/families';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import InviteMembers from '../components/InviteMembers';
import Approvals from './Approvals';
import CancelInvite from './CancelInvite';
import InvitationLink from './InvitationLink';
import RequireApproval from './RequireApproval';
import ResendInvite from './ResendInvite';

type Props = {
  family: GetFamily;
};

export default function InvitationsTab({ family }: Props) {
  const pendingInvites = family.invites.filter((invite) => !invite.needsApproval);

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
            {pendingInvites.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No pending invitations</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingInvites.map((invite) => (
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

      <Approvals family={family} />

      <Card>
        <CardHeader>
          <CardTitle>Invitation Settings</CardTitle>
          <CardDescription>Manage how people can join your family</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <>
            <InvitationLink family={family} />
            <RequireApproval family={family} />
          </>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
