import { Calendar, ChevronDown, ChevronRight, MessageSquare, Search, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Doc } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';

type Props = {
  channels: Doc<'channels'>[];
  activeChannel?: string;
};
export default function ChannelsList({ channels }: Props) {
  const familyChannels = channels.filter((channel) => channel.type === 'family');
  const eventChannels = channels.filter((channel) => channel.type === 'event');
  const individualChannels = channels.filter((channel) => channel.type === 'individual' || channel.type === 'anonymous');

  const [familiesOpen, setFamiliesOpen] = useState(true);
  const [eventsOpen, setEventsOpen] = useState(true);
  const [individualsOpen, setIndividualsOpen] = useState(true);

  return (
    <Card className="flex flex-col border-r w-80 h-full">
      <CardHeader className="p-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search threads" className="pl-8" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto px-2">
        {!!familyChannels.length && (
          <Collapsible open={familiesOpen} onOpenChange={setFamiliesOpen}>
            <CollapsibleTrigger className={cn('flex items-center w-full text-sm font-medium p-2 hover:bg-accent rounded-md')}>
              {familiesOpen ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
              <Users className="h-4 w-4 mr-2" />
              <span>Families</span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {familyChannels.map((channel) => {
                return <ChannelItem key={channel._id} channel={channel} />;
              })}
            </CollapsibleContent>
          </Collapsible>
        )}
        {!!eventChannels.length && (
          <Collapsible open={eventsOpen} onOpenChange={setEventsOpen}>
            <CollapsibleTrigger className={cn('flex items-center w-full text-sm font-medium p-2 hover:bg-accent rounded-md')}>
              {eventsOpen ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
              <Calendar className="h-4 w-4 mr-2" />
              <span>Events</span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {eventChannels.map((channel) => {
                return <ChannelItem key={channel._id} channel={channel} />;
              })}
            </CollapsibleContent>
          </Collapsible>
        )}
        {!!individualChannels.length && (
          <Collapsible open={individualsOpen} onOpenChange={setIndividualsOpen}>
            <CollapsibleTrigger className={cn('flex items-center w-full text-sm font-medium p-2 hover:bg-accent rounded-md')}>
              {individualsOpen ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
              <MessageSquare className="h-4 w-4 mr-2" />
              <span>Direct Messages</span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {individualChannels.map((channel) => {
                return <ChannelItem key={channel._id} channel={channel} />;
              })}
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
}

function ChannelItem({ channel }: { channel: Doc<'channels'> }) {
  const unread = false;
  return (
    <Link
      href={`/dashboard/messages/${channel._id}`}
      key={channel._id}
      className={buttonVariants({ variant: 'ghost', className: 'w-[calc(100%-1.5rem)] justify-start p-5 mb-2 mx-3' })}
    >
      <div className="flex-1 text-left">
        <div className={cn('font-medium', { 'font-bold': unread })}>
          # {channel.name}
          {unread && <span className="bg-cyan-500 h-2 w-2 rounded-full inline-block mr-1" />}
        </div>
        {/* <div className="text-sm text-muted-foreground truncate">{channel.lastMessage}</div> */}
      </div>
    </Link>
  );
}
