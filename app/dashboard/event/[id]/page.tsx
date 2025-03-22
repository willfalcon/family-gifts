import { auth } from '@/auth';
import Title from '@/components/Title';
import { getActiveFamilyId } from '@/lib/rscUtils';
import { format } from 'date-fns';
import { redirect } from 'next/navigation';
// import Manager from './SecretSanta/Manager';
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
import Viewer from '@/components/ui/rich-text/viewer';
import { JSONContent } from '@tiptap/react';
import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import { getEvent } from '@/lib/queries/events';
import { getFamilies, getFamily } from '@/lib/queries/families';
// import Assignments from './SecretSanta/Assignments';
// import SecretSanta from './SecretSanta/SecretSanta';
import { getActiveMemberAll } from '@/lib/queries/family-members';
import { ErrorMessage } from '@/components/ErrorMessage';
import { SidebarProvider } from '@/components/ui/sidebar';
import FloatingMessages from '@/components/Messages/FloatingMessages';
import MessagesSidebar from '@/components/Messages/MessagesSidebar';
import EditEvent from './EditEvent';
import { Prisma } from '@prisma/client';
import EventHeader from './EventHeader';
import SecretSantaBanner from './SecretSantaBanner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DetailsTab from './DetailsTab';
import ParticipantsTab from './ParticipantsTab';
import WishListsTab from './WishLIstsTab';

type PageProps = {
  params: {
    id: string;
  };
};

export type EventForEventPage = Prisma.EventGetPayload<{
  include: {
    assignments: {
      include: {
        giver: {
          include: {
            user: true;
          };
        };
        receiver: {
          include: {
            user: true;
          };
        };
      };
    };
    managers: true;
  };
}>;

export type SSAssignment = Prisma.AssignmentGetPayload<{
  include: {
    giver: {
      include: {
        user: true;
      };
    };
    receiver: {
      include: {
        user: true;
      };
    };
  };
}>;

export type SSMember = Prisma.FamilyMemberGetPayload<{
  include: {
    user: true;
  };
}>;

export default async function EventPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in');
  }
  const { event, success, message } = await getEvent(params.id);
  if (!success || !event) {
    throw new Error(message);
  }

  const { success: familySuccess, message: familyMessage, family } = await getFamily();
  const me = await getActiveMemberAll();

  if (!familySuccess || !family) {
    throw new Error(familyMessage);
  }
  if (!me) {
    throw new Error(`Couldn't find you. Make sure you're logged in, and are a member of this family and actually invited to this event.`);
  }

  const isManager = family.managers.some((manager) => manager.id === me.id);

  const userAssignment = event.assignments?.find((assignment) => assignment.giverId === me.id);

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
        <SecretSantaBanner eventId={event.id} isManager={isManager} budget={event.secretSantaBudget} userRecipient={userAssignment?.receiver} />

        <Tabs defaultValue="details" className="space-y-6">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="wishlists">Wish Lists</TabsTrigger>
            {event.assignments && <TabsTrigger value="secretsanta">Secret Santa</TabsTrigger>}
          </TabsList>
          <DetailsTab event={event} />
          <ParticipantsTab family={family} />
          {/* <WishListsTab event={event} /> */}
        </Tabs>

        <FloatingMessages />
      </div>
      <MessagesSidebar eventId={params.id} session={session} />
    </SidebarProvider>
  );
}
