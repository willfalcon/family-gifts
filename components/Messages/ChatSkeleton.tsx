import { Search, Send } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';
import { Separator } from '../ui/separator';

export function ChannelListSkeleton() {
  return (
    <Card className="flex flex-col border-r w-80 h-full">
      <CardHeader className="p-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search threads" className="pl-8" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto px-0">
        <div className="w-full justify-start p-5 mb-2 flex gap-4">
          <Skeleton className="w-9 h-9 rounded-full" />
          <Skeleton className="h-8 grow" />
        </div>
      </CardContent>
    </Card>
  );
}

export function MessageSkeleton() {
  return (
    <div className="mb-4">
      <div className="flex items-start">
        <Skeleton className="h-8 w-8 mr-2 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-5 mb-1 w-[100px]" />
          <Skeleton className="h-5 w-[250px]" />
        </div>
      </div>
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="flex-1 flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="p-4">
          <Skeleton className="h-6 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-4 pt-0">
          <MessageSkeleton />
          <MessageSkeleton />
          <MessageSkeleton />
        </CardContent>
        <Separator />
        <CardFooter className="p-4">
          <div className="flex w-full">
            <Skeleton className="h-8 flex-1 mr-2" />
            <Skeleton className="h-8 w-[75px]" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
