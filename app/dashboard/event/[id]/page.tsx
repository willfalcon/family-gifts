import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import { getEvent } from '@/lib/queries/events';
import { SidebarProvider } from '@/components/ui/sidebar';
import FloatingMessages from '@/components/Messages/FloatingMessages';
import MessagesSidebar from '@/components/Messages/MessagesSidebar';
import EventHeader from './components/EventHeader';
import SecretSantaBanner from './components/SecretSantaBanner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DetailsTab from './components/DetailsTab';
import ParticipantsTab from './components/ParticipantsTab';
// import WishListsTab from './WishListsTab';
import { notFound } from 'next/navigation';
import EventAttendance from './components/EventAttendance';

type PageProps = {
  params: {
    id: string;
  };
};

export default async function EventPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/sign-in');
  }
  const event = await getEvent(params.id);

  if (!event) {
    notFound();
  }

  const isManager = event.managers.some((manager) => manager.id === session.user?.id);
  const userAssignment = event.assignments?.find((assignment) => assignment.giverId === session.user?.id);
  const invite = event.invites?.find((invite) => invite.email === session.user?.email);
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
            { name: event.name, href: `/dashboard/event/${event.id}` },
          ]}
        />

        <EventHeader event={event} isManager={isManager} />
        <EventAttendance invite={invite} />
        <SecretSantaBanner eventId={event.id} isManager={isManager} budget={event.secretSantaBudget} userRecipient={userAssignment?.recipient} />

        <Tabs defaultValue="details" className="space-y-6">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="wishlists">Wish Lists</TabsTrigger>
            {event.assignments && <TabsTrigger value="secretsanta">Secret Santa</TabsTrigger>}
          </TabsList>
          <DetailsTab event={event} />
          <ParticipantsTab event={event} />
          {/* <WishListsTab event={event} /> */}
        </Tabs>

        <FloatingMessages />
      </div>
      <MessagesSidebar eventId={params.id} session={session} />
    </SidebarProvider>
  );
}
