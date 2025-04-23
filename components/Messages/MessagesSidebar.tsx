'use client';

import { useQuery } from 'convex/react';
import { Session } from 'next-auth';

import { api } from '@/convex/_generated/api';

import Chat from '@/app/dashboard/messages/Chat';
import { Sidebar, SidebarContent, SidebarGroup } from '../ui/sidebar';
import { ChatSkeleton } from './ChatSkeleton';

type Props = {
  eventId?: string;
  familyId?: string;
  session: Session;
};

export default function MessagesSidebar({ eventId, familyId, session }: Props) {
  if (!session) return;
  const channels = useQuery(api.channels.getChannels, { userId: session.user!.id! });

  const channel =
    (eventId || familyId) && channels !== 'no channels'
      ? channels?.find((channel) => channel.event === eventId || channel.family === familyId)
      : null;

  return (
    <Sidebar side="right" collapsible="offcanvas" className="h-auto">
      <SidebarContent>
        <SidebarGroup>
          {channel ? <Chat channel={channel} user={session.user!.id!} sidebar /> : <ChatSkeleton />}
          {/* <ChatSkeleton /> */}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

// export function ChatSkeleton() {
//   return (
//     <div className="flex-1 flex flex-col">
//       <Card className="flex-1 flex flex-col">
//         <CardHeader className="p-4">
//           <Skeleton className="h-6 w-[100px]" />
//           <Skeleton className="h-5 w-[125px]" />
//         </CardHeader>
//         <CardContent className="flex-1 overflow-auto p-4 pt-0">
//           <div className="mb-4">
//             <div className="flex items-start">
//               <Skeleton className="w-8 h-8 rounded-full mr-2" />
//               <div className="flex-1">
//                 <Skeleton className="h-5 w-[50px]" />
//                 <Skeleton className="h-5 w-[30px]" />
//                 <Skeleton className="h-5 w-[100px]" />
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
