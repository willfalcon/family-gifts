import { isSameDay } from 'date-fns';
import { ArrowLeft, ChevronsDown, Send } from 'lucide-react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Doc } from '@/convex/_generated/dataModel';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn, formatDate } from '@/lib/utils';
import useMessages from './useMessages';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import Message from './Message';

type Props = {
  channel: Doc<'channels'>;
  user: string;
  sidebar?: boolean;
  dialog?: boolean;
};

function scrollToBottom(scrollArea: HTMLDivElement | null) {
  if (scrollArea) {
    const scrollable = scrollArea.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollable) {
      scrollable.scrollTo({
        top: scrollable.scrollHeight,
      });
    }
  }
}

export default function Chat({ channel, user, sidebar = false, dialog = false }: Props) {
  const { messages, lastReadTime, setLastRead, sendMessage, orderedMessages, newestMessage, hasUnreadMessages } = useMessages({
    channelId: channel._id,
    userId: user,
  });

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [hasInitialized, setHasInitialized] = useState(false);

  const mobile = useIsMobile();

  useEffect(() => {
    if (messages !== undefined && scrollAreaRef.current && !hasInitialized) {
      scrollToBottom(scrollAreaRef.current);
      setHasInitialized(true);
    }
  }, [messages, hasInitialized]);

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

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    const bottomElement = bottomRef.current;
    if (!scrollArea || !bottomElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (orderedMessages.length === 0) return;

          if (lastReadTime === null) {
            setLastRead({ userId: user, channelId: channel._id, messageId: newestMessage._id });
          } else if (lastReadTime !== undefined && new Date(lastReadTime) < new Date(newestMessage._creationTime)) {
            setLastRead({ userId: user, channelId: channel._id, messageId: newestMessage._id });
          }
        }
      },
      {
        root: scrollArea,
        threshold: 0,
      },
    );

    observer.observe(bottomElement);
    return () => observer.disconnect();
  }, [orderedMessages, lastReadTime, user, channel._id]);

  useEffect(() => {
    if (newestMessage && newestMessage.sender === user) {
      scrollToBottom(scrollAreaRef.current);
    }
  }, [newestMessage]);

  const ChatInner = (
    <ScrollArea className={`h-full`} ref={scrollAreaRef}>
      {!!messages?.length ? (
        orderedMessages.map((message, index) => {
          const lastMessageDate = messages[index - 1]?._creationTime || new Date();
          const isRead = (lastReadTime && new Date(lastReadTime) >= new Date(message._creationTime)) || false;
          return (
            <Fragment key={message._id}>
              {!isSameDay(lastMessageDate, new Date(message._creationTime)) && (
                <>
                  {index > 0 && <Separator className="my-4" />}
                  <p className="text-center text-xs text-muted-foreground mb-4">{formatDate(new Date(message._creationTime))}</p>
                </>
              )}
              {index === 0 && <p className="text-center text-xs text-muted-foreground mb-4">{formatDate(new Date(message._creationTime))}</p>}
              <Message message={message} channel={channel} isRead={isRead} />
            </Fragment>
          );
        })
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">No messages here yet!</div>
      )}
      <div ref={bottomRef} className="h-1" />
      {hasUnreadMessages && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-2 bg-sidebar rounded-md shadow-sm animate-bounce">
          <ChevronsDown className="w-4 h-4" />
        </div>
      )}
    </ScrollArea>
  );

  const ChatForm = (
    <form className="flex w-full" onSubmit={handleSubmit}>
      <Input name="text" placeholder="Type a message..." className="flex-1 mr-2" />
      <Button type="submit" size={sidebar ? 'icon' : 'default'}>
        <Send className={cn('h-4 w-4', { 'mr-2': !sidebar })} />
        {sidebar ? '' : 'Send'}
      </Button>
    </form>
  );

  return dialog ? (
    <div className="grid grid-rows-[84px_calc(var(--messages-dialog-height)-168px)_1px_76px]">
      <DialogHeader className="p-6 pb-4">
        <DialogTitle>{channel.name}</DialogTitle>
        <DialogDescription>
          {channel.type === 'family' && 'Family Thread'}
          {channel.type === 'event' && 'Event Thread'}
          {channel.type === 'individual' && 'Private Message'}
        </DialogDescription>
      </DialogHeader>
      <CardContent className="px-6 pt-0 h-[calc(var(--messages-dialog-height)-168px)]">{ChatInner}</CardContent>
      <Separator />
      <DialogFooter className="p-6 pt-4">{ChatForm}</DialogFooter>
    </div>
  ) : (
    <div className="flex-1 flex flex-col">
      {mobile && (
        <Link href="/dashboard/messages" className="p-4 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to channels
        </Link>
      )}
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
          <CardContent className="flex-1 overflow-auto p-4 pt-0">{ChatInner}</CardContent>
          <Separator />
          <CardFooter className="p-4">{ChatForm}</CardFooter>
        </Card>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">No messages here yet!</div>
      )}
    </div>
  );
}
