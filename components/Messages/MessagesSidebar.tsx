'use client';

import Chat from '@/app/dashboard/messages/Chat';
import { Sidebar, SidebarContent, SidebarGroup } from '../ui/sidebar';
import { Session } from 'next-auth';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ReceiptEuroIcon } from 'lucide-react';

type Props = {
  eventId?: string;
  familyId?: string;
  session: Session;
};

export default function MessageSidebar({ eventId, familyId, session }: Props) {
  const channels = useQuery(api.channels.getChannels, { userId: session.user!.id! });
  if (!session) return;
  if (!channels) return <p>todo: Chat skeleton</p>;
  const channel = eventId || familyId ? channels.find((channel) => channel.event === eventId || channel.family === familyId) : null;
  if (!channel) return;
  return (
    <Sidebar side="right" collapsible="offcanvas">
      <SidebarContent>
        <SidebarGroup>
          <Chat channel={channel} user={session.user!.id!} sidebar />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
