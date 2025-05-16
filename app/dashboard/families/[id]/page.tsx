import { auth } from '@/auth';
import { User } from '@prisma/client';
import { cache } from 'react';

import { getFamily } from '@/lib/queries/families';
import { getUser as getUserQuery } from '@/lib/queries/user';
import { notFound, redirect } from 'next/navigation';

import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventsTab from './EventsTab/EventsTab';
import InvitationsTab from './InvitationsTab/InvitationsTab';
import MembersTab from './MembersTab/MembersTab';
import FamilyHeader from './components/FamilyHeader';
import WishListsTab from './components/WishListsTab';

const getUser = cache(async (id: User['id']) => {
  return await getUserQuery(id);
});

type Props = { params: Promise<{ id: string }> };

export default async function FamilyPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  // not found if user is not a member of the family
  const { id } = await params;
  const family = await getFamily(id);
  if (!family.members.some((member) => member.id === session.user?.id)) {
    notFound();
  }

  const isManager = family.managers.some((manager) => manager.id === session.user?.id);

  const me = await getUser(session.user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Families', href: '/dashboard/families' },
          { name: family.name, href: `/dashboard/families/${family.id}` },
        ]}
      />
      <FamilyHeader family={family} isManager={isManager} me={me} />

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="wishlists">Wish Lists</TabsTrigger>
          {isManager && <TabsTrigger value="invitations">Invitations</TabsTrigger>}
        </TabsList>

        <MembersTab isManager={isManager} family={family} />
        <EventsTab family={family} />
        <WishListsTab members={family.members} family={family} />
        {isManager && <InvitationsTab family={family} />}
      </Tabs>
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const family = await getFamily(id);
  return {
    title: `${family?.name}`,
    description: `Manage ${family?.name} on Family Gifts`,
    robots: {
      index: false,
    },
  };
}
