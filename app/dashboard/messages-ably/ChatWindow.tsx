import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Menubar, MenubarContent, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Channel } from '@prisma/client';
import { MenubarItem } from '@radix-ui/react-menubar';
import { Message } from 'ably';
import { clear } from 'console';
import { EllipsisVertical, Send } from 'lucide-react';
import { FormEvent } from 'react';

type ChatWindowProps = {
  channel: Channel;
  messages: Message[];
  // messages: string[];
  handleSendMessage: (e: FormEvent<HTMLFormElement>) => void;
};
export default function ChatWindow({ channel, messages, handleSendMessage }: ChatWindowProps) {
  return (
    <div className="flex-1 flex flex-col">
      {channel ? (
        <>
          <Card className="flex-1 flex flex-col">
            <CardHeader className="p-4">
              <CardTitle>{channel.name}</CardTitle>
              <CardDescription>
                {channel.type === 'family' && 'Family Thread'}
                {channel.type === 'event' && 'Event Thread'}
                {channel.type === 'individual' && 'Private Message'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-4">
              <ScrollArea className="h-full">
                {messages.map((message) => {
                  const {
                    data: { sender, text, timestamp },
                    id,
                  } = message;
                  return (
                    <div key={id} className="mb-4">
                      <div className="flex items-start">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={sender.name} />
                          <AvatarFallback>{sender.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{sender.name}</div>
                          <div className="text-sm">{text}</div>
                          <div className="text-xs text-muted-foreground mt-1 ml-10">{timestamp}</div>
                        </div>
                        {/* <Menubar>
                          <MenubarMenu>
                            <MenubarTrigger className='cursor-pointer'>
                              <EllipsisVertical size={16} />
                            </MenubarTrigger>
                            <MenubarContent>
                              <MenubarItem disabled={!userCanDelete(message, user)}
                              onClick={() => onDelete(message.extras.timeserial)}>
                                Delete
                              </MenubarItem>
                            </MenubarContent>
                          </MenubarMenu>
                        </Menubar> */}
                      </div>
                    </div>
                  );
                })}
              </ScrollArea>
            </CardContent>
            <Separator />
            <CardFooter className="p-4">
              <form onSubmit={handleSendMessage} className="flex w-full">
                <Input name="message" placeholder="Type a message..." className="flex-1 mr-2" />
                <Button type="submit">
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </form>
            </CardFooter>
          </Card>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">No messages here yet!</div>
      )}
    </div>
  );
}
