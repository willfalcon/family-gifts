import Chat from '@/app/dashboard/messages/Chat';
import { Sidebar, SidebarContent, SidebarGroup } from '../ui/sidebar';
import { FamilyMemberWithUserAssignments } from '@/prisma/types';
import { GetChannelReturnType } from '@/lib/queries/chat';
import ChatProviders from '@/app/dashboard/messages/ChatProviders';

export default function MessagesSidebar({ channel, me }: { channel: GetChannelReturnType; me: FamilyMemberWithUserAssignments }) {
  return (
    <Sidebar side="right" collapsible="offcanvas">
      <SidebarContent>
        <SidebarGroup>
          <ChatProviders defaultChannel={channel}>
            <Chat channel={channel} me={me!} sidebar />
          </ChatProviders>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
