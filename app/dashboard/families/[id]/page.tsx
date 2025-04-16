import { auth } from '@/auth';

import { getFamily } from '@/lib/queries/families';
import { redirect } from 'next/navigation';

import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUser } from '@/lib/queries/user';
import EventsTab from './EventsTab/EventsTab';
import InvitationsTab from './InvitationsTab/InvitationsTab';
import MembersTab from './MembersTab/MembersTab';
import FamilyHeader from './components/FamilyHeader';
import WishListsTab from './components/WishListsTab';

export default async function FamilyPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in');
  }

  if (!session.user.id) {
    redirect('/sign-in');
  }

  const family = await getFamily(params.id);

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
        <EventsTab members={family.members} />
        <WishListsTab members={family.members} />
        {isManager && <InvitationsTab family={family} />}
      </Tabs>
    </div>
  );
}
