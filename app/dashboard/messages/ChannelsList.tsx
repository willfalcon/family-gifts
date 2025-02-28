import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Doc } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import Link from 'next/link';

type Props = {
  channels: Doc<'channels'>[];
};
export default function ChannelsList({ channels }: Props) {
  return (
    <Card className="flex flex-col border-r w-80 h-full">
      <CardHeader className="p-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search threads" className="pl-8" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto px-0">
        {channels?.map((channel) => {
          const unread = false;
          return (
            <Link
              href={`/dashboard/messages/${channel._id}`}
              key={channel._id}
              className={buttonVariants({ variant: 'ghost', className: 'w-full justify-start p-5 mb-2' })}
            >
              <Avatar className="h-9 w-9 mr-3">
                <AvatarFallback>{channel.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <div className={cn('font-medium', { 'font-bold': unread })}>
                  {unread && <span className="bg-cyan-500 h-2 w-2 rounded-full inline-block mr-1" />}
                  {channel.name}
                </div>
                {/* <div className="text-sm text-muted-foreground truncate">{channel.lastMessage}</div> */}
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
