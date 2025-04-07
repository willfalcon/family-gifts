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
import { Mail, Share2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import { JSONContent } from '@tiptap/react';
import { getLists } from '@/lib/queries/lists';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';

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

  const allItemsCount = lists.reduce((total, list) => total + list._count.items, 0);

  const isAdmin = member.family.managers.some((manager) => manager.id === params.memberId);

  return (
    <div className="container mx-auto px-4 py-8">
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Family', href: '/dashboard/family' },
          { name: member.name, href: `/dashboard/family/${member.id}` },
        ]}
      />

      {/* Member Profile Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Avatar className="h-24 w-24">
            <AvatarImage src={memberUser?.image || undefined} alt={member.name} />
            <AvatarFallback>
              {member.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
              <div>
                <Title>{member.name}</Title>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={isAdmin ? 'default' : 'secondary'}>{isAdmin ? 'Admin' : 'Member'}</Badge>
                  <span className="text-muted-foreground">{member.email}</span>
                </div>
                <p className="text-muted-foreground mt-2">Member of {member.family.name}</p>
              </div>
              <div className="flex gap-2">
                <Button>
                  <Mail className="mr-2 h-4 w-4" />
                  Message
                </Button>
                <Button variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            {member.info && (
              <div className="mt-4">
                <Viewer content={member.info as JSONContent} immediatelyRender={false} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {listSuccess ? (
          lists.map((list) => (
            <Card id={list.id}>
              <CardHeader>
                <CardTitle>{list.name}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  <Viewer content={list.description as JSONContent} immediatelyRender={false} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span>{list._count.items} items</span>
                  {list.updatedAt && <span className="text-muted-foreground">Updated {formatDistanceToNow(list.updatedAt)}</span>}
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/dashboard/wish-lists/${list.id}`} className={buttonVariants({ size: 'sm', className: 'w-full' })}>
                  View Wish List
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <ErrorMessage title={listMessage} />
        )}
      </div>
    </div>
  );
}
