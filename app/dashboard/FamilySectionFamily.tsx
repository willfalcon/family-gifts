'use client';

import { FamilyFromDashboardGetFamilies, MemberFromDashboardGetFamilies } from '@/lib/queries/families';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronRight, Gift, Loader2, Mail } from 'lucide-react';
import { useState } from 'react';
import { dashboardGetMoreMembers } from './actions';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function FamilySectionFamily({ family }: { family: FamilyFromDashboardGetFamilies }) {
  const [expanded, setExpanded] = useState(true);

  const infiniteQuery = useInfiniteQuery({
    queryKey: ['familyMembers', family.id],
    queryFn: async ({ pageParam }): Promise<MemberFromDashboardGetFamilies[]> => {
      return await dashboardGetMoreMembers(family.id, pageParam);
    },
    initialPageParam: false,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPageParam) return null;
      return true;
    },
    initialData: { pages: [family.members], pageParams: [false] },
  });

  console.log(infiniteQuery);

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = infiniteQuery;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <h3 className="text-lg font-medium flex items-center">
          {expanded ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
          {family.name}
        </h3>

        <Link href={`/dashboard/families/${family.id}`} className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
          View Family
        </Link>
      </div>

      {expanded && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-col-4 mb-4">
            {data.pages.map((page) =>
              page.map((member) => {
                const isManager = member.managing.some((managedFam) => managedFam.id === family.id);
                return (
                  <Card key={member.id}>
                    <CardHeader className="flex flex-row items-start space-y-0 pb-2">
                      <div className="flex flex-1 items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={member.image || undefined} alt={member.name || ''} />
                          <AvatarFallback>
                            {member.name
                              ?.split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">
                            <Link href={`/dashboard/family-members/${member.id}`} className="hover:underline">
                              {member.name}
                            </Link>
                          </CardTitle>
                          <CardDescription className="text-xs">{member.email}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm">
                        <Badge variant={isManager ? 'default' : 'secondary'} className="text-xs">
                          {isManager ? 'Manager' : 'Member'}
                        </Badge>
                        <span className="text-muted-foreground text-xs">{member._count.lists} wish lists</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between p-2">
                      {/* //TODO: implement message button */}
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/family-members/${member.id}`}>
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
          {hasNextPage && (
            <div className="mt-4 flex justify-center">
              <Button variant="outline" onClick={() => fetchNextPage()} className="w-full max-w-xs" disabled={isFetchingNextPage}>
                {isFetchingNextPage && <Loader2 className="animate-spin mr-2" />}
                Show More <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
