import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useMe } from '../Providers';
import { Doc } from '@/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { Send } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { Fragment } from 'react';
import { format, isSameDay } from 'date-fns';
import { toast } from 'sonner';
import Message from './Message';
import { ChatSkeleton } from '@/components/Messages/ChatSkeleton';

type Props = {
  channel: Doc<'channels'>;
  user: string;
  sidebar?: boolean;
};
export default function Chat({ channel, user, sidebar = false }: Props) {
  const messages = useQuery(api.messages.getMessages, { channelId: channel._id });

  const sendMessage = useMutation(api.messages.sendMessage);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const text = formData.get('text') as string;
    if (!text.trim()) {
      return;
    }
    try {
      await sendMessage({ channel: channel._id, user, text });
    } catch (error) {
      console.error(error);
      toast.error(`Couldn't send message`, {
        description: `There might be more info in the console`,
      });
    }
    form.reset();
  }

  return (
    <div className="flex-1 flex flex-col">
      {channel ? (
        <Card className="flex-1 flex flex-col">
          <CardHeader className="p-4">
            <CardTitle>{channel.name}</CardTitle>
            <CardDescription>
              {channel.type === 'family' && 'Family Thread'}
              {channel.type === 'event' && 'Event Thread'}
              {channel.type === 'individual' && 'Private Message'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-4 pt-0">
            <ScrollArea className="h-full">
              {messages?.map((message, index) => {
                const lastMessageDate = messages[index - 1]?._creationTime || new Date();
                return (
                  <Fragment key={message._id}>
                    {!isSameDay(lastMessageDate, new Date(message._creationTime)) && (
                      <>
                        {index > 0 && <Separator className="my-4" />}
                        <p className="text-center text-xs text-muted-foreground mb-4">{format(new Date(message._creationTime), 'MMM dd, yyyy')}</p>
                      </>
                    )}
                    <Message message={message} channel={channel} />
                  </Fragment>
                );
              })}
            </ScrollArea>
          </CardContent>
          <Separator />
          <CardFooter className="p-4">
            {/* <form onSubmit={handleSendMessage} className="flex w-full"> */}
            <form className="flex w-full" onSubmit={handleSubmit}>
              <Input name="text" placeholder="Type a message..." className="flex-1 mr-2" />
              <Button type="submit" size={sidebar ? 'icon' : 'default'}>
                <Send className={cn('h-4 w-4', { 'mr-2': !sidebar })} />
                {sidebar ? '' : 'Send'}
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">No messages here yet!</div>
      )}
    </div>
  );
}
