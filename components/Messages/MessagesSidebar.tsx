import Chat from '@/app/dashboard/messages/Chat';
import { Sidebar, SidebarContent, SidebarGroup } from '../ui/sidebar';
import { ChannelWithMessages, FamilyMemberWithUser } from '@/prisma/types';

export default function MessagesSidebar({ channel, me }: { channel: ChannelWithMessages; me: FamilyMemberWithUser }) {
  return (
    <Sidebar side="right" collapsible="offcanvas">
      <SidebarContent>
        <SidebarGroup>
          <Chat channel={channel} me={me!} sidebar />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
