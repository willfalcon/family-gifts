import { auth } from '@/auth';
import { ErrorMessage } from '@/components/ErrorMessage';
import FamilySelect from '@/components/FamilySelect';
import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import Title from '@/components/Title';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Viewer from '@/components/ui/rich-text/viewer';
import { getFamilyMemberById, getMemberUser } from '@/lib/queries/family-members';
import { getActiveFamilyId } from '@/lib/rscUtils';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Mail } from 'lucide-react';
import { redirect } from 'next/navigation';
import { JSONContent } from '@tiptap/react';
import { getLists } from '@/lib/queries/lists';
import Link from 'next/link';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function FamilyMemberPage({ params }: { params: { memberId: string } }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const { member, success, message } = await getFamilyMemberById(params.memberId);

  if (!success || !member) {
    return <ErrorMessage title={message} />;
  }

  const activeFamilyId = await getActiveFamilyId();
  if (!activeFamilyId || member.familyId !== activeFamilyId) {
    return <ErrorMessage title="You must be in the family to see this page. Try changing your active family?">{<FamilySelect />}</ErrorMessage>;
  }

  const memberUser = await getMemberUser(member);

  const { lists, message: listMessage, success: listSuccess } = await getLists(memberUser?.id);

  return (
    <div className="space-y-4 p-8 pt-6">
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Family', href: '/dashboard/family' },
          { name: member.name, href: `/dashboard/family/${member.id}` },
        ]}
      />

      <div className="flex items-center space-x-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={memberUser?.image || undefined} alt={member.name} />
          <AvatarFallback>{member.name[0]}</AvatarFallback>
        </Avatar>
        <Title>{member.name}</Title>
      </div>

      <div className="flex items-center space-x-2">
        <Mail className="w-4 h-4 text-muted-foreground" />
        <span>{member.email}</span>
      </div>

      <Viewer content={member.info as JSONContent} style="prose" immediatelyRender={false} />

      {/* Add list page for all items. Maybe at /family/[memberId]/list/all */}
      {listSuccess ? (
        lists.map((list) => (
          <Link key={list.id} href={`/dashboard/family/${member.id}/list/${list.id}`}>
            <Card>
              <CardHeader>
                <CardTitle>{list.name}</CardTitle>
                <CardDescription>{list._count.items} items</CardDescription>
              </CardHeader>
              <CardFooter className="justify-between">
                <Button variant="outline">View List</Button>
              </CardFooter>
            </Card>
          </Link>
        ))
      ) : (
        <ErrorMessage title={listMessage} />
      )}
    </div>
  );
}
