import { auth } from '@/auth';
import Title, { SubTitle } from '@/components/Title';
import { Badge } from '@/components/ui/badge';
import Viewer from '@/components/ui/rich-text/viewer';
import { getFamily } from '@/lib/queries/families';
import { redirect } from 'next/navigation';
import { JSONContent } from '@tiptap/react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Mail, MoreHorizontal, PenSquare, Share, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MembersTab from './MembersTab';
import EventsTab from './EventsTab';
import WishListsTab from './WishListsTab';
import InvitationsTab from './InvitationsTab';

export default async function FamilyPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in');
  }

  const family = await getFamily(params.id);

  const isManager = family.managers.some((manager) => manager.id === session.user?.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <Title>{family.name}</Title>
            <Badge variant="outline">{family._count.members} members</Badge>
          </div>
          {family.description && <Viewer className="text-muted-foreground" content={family.description as JSONContent} immediatelyRender={false} />}
          <p className="text-sm text-muted-foreground mt-1">
            Created by {family.creator.name} • {format(family.createdAt, 'yyyyI-mm-dd')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Mail className="mr-2 h-4 w-4" />
            Message All
          </Button>
          <Button variant="outline" size="sm">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isManager && (
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/families/${params.id}/edit`}>
                    <PenSquare className="mr-2 h-4 w-4" />
                    Edit Family
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                Message All
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Leave Family</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="wishlists">Wish Lists</TabsTrigger>
          {isManager && <TabsTrigger value="invitations">Invitations</TabsTrigger>}
        </TabsList>

        <MembersTab isManager={isManager} family={family} />
        <EventsTab members={family.members} />
        <WishListsTab members={family.members} />
        {isManager && <InvitationsTab family={family} />}
      </Tabs>
    </div>
  );
}
