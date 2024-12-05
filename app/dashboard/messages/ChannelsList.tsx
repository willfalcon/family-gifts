import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/rscUtils';
import { ChannelWithMessagesReadyBy } from '@/prisma/types';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Channel } from '@prisma/client';
import { Search } from 'lucide-react';
import Link from 'next/link';

interface ChannelListProps {
  channels: ChannelWithMessagesReadyBy[];
}

export default function ChannelsList({ channels }: ChannelListProps) {
  return (
    <Card className="flex flex-col border-r w-80 h-full">
      <CardHeader className="p-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search threads" className="pl-8" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto px-0">
        {channels.map((channel) => {
          const unread = channel.messages.some((m) => !m.readBy.length);
          return (
            <Link
              href={`/dashboard/messages/${channel.id}`}
              key={channel.id}
              className={buttonVariants({ variant: 'ghost', className: 'w-full justify-start p-5 mb-2' })}
            >
              {/* <Button variant="ghost" className="w-full justify-start p-3" key={channel.id} onClick={() => setChannel(channel)}> */}
              <Avatar className="h-9 w-9 mr-3">
                <AvatarFallback>{channel.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <div className={cn('font-medium', { 'font-bold': unread })}>
                  {unread && <span className="bg-cyan-500 h-2 w-2 rounded-full inline-block mr-1" />}
                  {channel.name}
                </div>
                <div className="text-sm text-muted-foreground truncate">{channel.lastMessage}</div>
              </div>
            </Link>
          );
        })}
        {/* </ScrollArea> */}
      </CardContent>
      {/* <CardFooter className="p-2"> */}
      {/* <Button
          variant="ghost"
          size="icon"
          // onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="ml-auto"
        > */}
      {/* {isSidebarCollapsed ?  */}
      {/* <ChevronRight className="h-4 w-4" /> */}
      {/* //  : <ChevronLeft className="h-4 w-4" /> */}
      {/* </Button> */}
      {/* </CardFooter> */}
    </Card>
  );
}
