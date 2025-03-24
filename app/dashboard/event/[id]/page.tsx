import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import { getEvent } from '@/lib/queries/events';
import { SidebarProvider } from '@/components/ui/sidebar';
import FloatingMessages from '@/components/Messages/FloatingMessages';
import MessagesSidebar from '@/components/Messages/MessagesSidebar';
import EventHeader from './EventHeader';
import SecretSantaBanner from './SecretSantaBanner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DetailsTab from './DetailsTab';
import ParticipantsTab from './ParticipantsTab';
// import WishListsTab from './WishListsTab';

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

  const isCreator = event.creatorId === session.user.id;
  const userAssignment = event.assignments?.find((assignment) => assignment.giverId === session.user?.id);
  console.log(session);
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

        <EventHeader event={event} isManager={isCreator} />
        <SecretSantaBanner eventId={event.id} isManager={isCreator} budget={event.secretSantaBudget} userRecipient={userAssignment?.recipient} />

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
