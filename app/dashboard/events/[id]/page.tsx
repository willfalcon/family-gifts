import { auth } from '@/auth';
import { notFound, redirect } from 'next/navigation';

import { canViewEvent } from '@/lib/permissions';
import { getEvent } from '@/lib/queries/events';

import FloatingMessages from '@/components/Messages/FloatingMessages';
import MessagesSidebar from '@/components/Messages/MessagesSidebar';
import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUser as getUserQuery } from '@/lib/queries/user';
import { User } from '@prisma/client';
import { cache } from 'react';
import DetailsTab from './components/DetailsTab';
import EventAttendance from './components/EventAttendance';
import EventHeader from './components/EventHeader';
import MyAssignment from './components/MyAssignment';
import ParticipantsTab from './components/ParticipantsTab';
import SecretSantaTab from './components/SecretSantaTab';
import SetupSecretSanta from './components/SetupSecretSanta';
import WishListsTab from './components/WishListsTab';

type PageProps = {
  params: {
    id: string;
  };
};

const getUser = cache(async (id: User['id']) => {
  return await getUserQuery(id);
});

export default async function EventPage({ params }: PageProps) {
  const event = await getEvent(params.id);
  if (!event) {
    notFound();
  }

  const session = await auth();
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const canViewPage = await canViewEvent(event.id, session.user.id);
  if (!canViewPage) {
    throw new Error('You must be invited to this event to view it.');
  }

  const isManager = event.managers.some((manager) => manager.id === session.user?.id);
  const userAssignment = event.assignments?.find((assignment) => assignment.giverId === session.user?.id);
  const invite = event.invites?.find((invite) => invite.email === session.user?.email);
  const me = await getUser(session.user.id);

  if (!invite) {
    redirect('/dashboard/events');
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="space-y-4 p-8 pt-6 relative w-full">
        <SetBreadcrumbs
          items={[
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Events', href: '/dashboard/events' },
            { name: event.name, href: `/dashboard/events/${event.id}` },
          ]}
        />

        <EventHeader event={event} isManager={isManager} me={me} />
        <EventAttendance invite={invite} />
        {!!event.assignments.length && <MyAssignment assignment={userAssignment?.recipient} />}
        {!event.assignments.length && isManager && <SetupSecretSanta eventId={event.id} />}
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="wishlists">Wish Lists</TabsTrigger>
            {(!!event.assignments.length || isManager) && <TabsTrigger value="secretsanta">Secret Santa</TabsTrigger>}
          </TabsList>
          <DetailsTab event={event} />
          <ParticipantsTab event={event} />
          <WishListsTab event={event} />
          {(!!event.assignments.length || isManager) && <SecretSantaTab event={event} userId={session.user?.id} isManager={isManager} />}
        </Tabs>

        <FloatingMessages />
      </div>
      <MessagesSidebar eventId={params.id} session={session} />
    </SidebarProvider>
  );
}
