import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Channel } from '@prisma/client';
import { ChevronRight, Search } from 'lucide-react';
import { useChatContext } from './ChatProviders';

interface ChannelListProps {
  channels: Channel[];
}

export default function ChannelsList({ channels }: ChannelListProps) {
  const [_, setChannel] = useChatContext();
  return (
    <Card className="flex flex-col border-r w-80">
      <CardHeader className="p-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search threads" className="pl-8" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0">
        <ScrollArea className="h-full">
          <Button variant="ghost" className="w-full justify-start p-3">
            <Avatar className="h-9 w-9 mr-3">
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <div className="font-medium">Thread Name</div>
              <div className="text-sm text-muted-foreground truncate">Sample message goes here</div>
            </div>
          </Button>
          {channels.map((channel) => (
            <Button variant="ghost" className="w-full justify-start p-3" key={channel.id} onClick={() => setChannel(channel)}>
              <Avatar className="h-9 w-9 mr-3">
                <AvatarFallback>{channel.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <div className="font-medium">{channel.name}</div>
                <div className="text-sm text-muted-foreground truncate">{channel.lastMessage}</div>
              </div>
            </Button>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-2">
        <Button
          variant="ghost"
          size="icon"
          // onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="ml-auto"
        >
          {/* {isSidebarCollapsed ?  */}
          <ChevronRight className="h-4 w-4" />
          {/* //  : <ChevronLeft className="h-4 w-4" /> */}
        </Button>
      </CardFooter>
    </Card>
  );
}
