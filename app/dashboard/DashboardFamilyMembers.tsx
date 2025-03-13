'use client';

import { ErrorMessage } from '@/components/ErrorMessage';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MemberForDashboard } from '@/prisma/types';
import { Family } from '@prisma/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ChevronDown, Gift, Loader, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { dashboardGetMembers } from './actions';

type ReturnProps = {
  success: boolean;
  message: string;
  members: MemberForDashboard[];
  count: number;
};

type Props = ReturnProps & {
  activeFamilyId: Family['id'];
};

export default function DashboardFamilyMembers({ success, members, message, activeFamilyId, count }: Props) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, ...rest } = useInfiniteQuery({
    queryKey: ['dashboardGetMembers'],
    queryFn: async ({ pageParam }): Promise<MemberForDashboard[]> => {
      return await dashboardGetMembers(pageParam);
    },
    initialPageParam: false,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPageParam) return null;
      return true;
    },
    initialData: { pages: [members], pageParams: [false] },
  });

  if (!success) {
    return <ErrorMessage title={message} />;
  }

  const manyMore = count - 3;
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Family Members</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        {data?.pages.map((page) =>
          page.map((member) => {
            const isAdmin = member.managing.some((managedFam) => managedFam.id === activeFamilyId);
            return (
              <Card key={member.id}>
                <CardHeader className="flex flex-row items-start space-y-0 pb-2">
                  <div className="flex flex-1 items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={member.user?.image || undefined} alt={member.name} />
                      <AvatarFallback>
                        {member.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{member.name}</CardTitle>
                      <CardDescription className="text-xs">{member.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <Badge variant={isAdmin ? 'default' : 'secondary'} className="text-xs rounded-full">
                      {isAdmin ? 'Admin' : 'Member'}
                    </Badge>
                    <span className="text-muted-foreground text-xs">{member.user?._count.lists} wish lists</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-2">
                  <Button variant="ghost" size="sm">
                    <Mail className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/family/${member.id}`}>
                      <Gift className="h-4 w-4 mr-1" />
                      Lists
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          }),
        )}
      </div>

      {hasNextPage && manyMore > 0 && (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" onClick={() => fetchNextPage()} className="w-full max-w-xs" disabled={isFetchingNextPage}>
            {isFetchingNextPage && <Loader2 className="animate-spin mr-2" />}
            Show {manyMore} More <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  );
}
