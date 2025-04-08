import { auth } from '@/auth';

import { getFamily } from '@/lib/queries/families';
import { redirect } from 'next/navigation';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MembersTab from './components/MembersTab';
import EventsTab from './components/EventsTab';
import WishListsTab from './components/WishListsTab';
import InvitationsTab from './components/InvitationsTab';
import FamilyHeader from './components/FamilyHeader';
export default async function FamilyPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in');
  }

  const family = await getFamily(params.id);

  const isManager = family.managers.some((manager) => manager.id === session.user?.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <FamilyHeader family={family} isManager={isManager} />

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
