'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { FamilyFromDashboardGetFamilies, MemberFromDashboardGetFamilies } from '@/lib/queries/families';
import { dashboardGetMoreMembers } from '../actions';

import MemberCard from '@/components/MemberCard';
import { Button, buttonVariants } from '@/components/ui/button';

export default function FamilySectionFamily({ family }: { family: FamilyFromDashboardGetFamilies }) {
  const [expanded, setExpanded] = useState(true);

  const hasMore = family._count.members > family.members.length;

  const infiniteQuery = useInfiniteQuery({
    queryKey: ['familyMembers', family.id],
    queryFn: async ({ pageParam: getRest }): Promise<MemberFromDashboardGetFamilies[]> => {
      return await dashboardGetMoreMembers(family.id, getRest);
    },
    // This starts at false, so the initial query will get the initial page.
    initialPageParam: false,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      // this starts at false, so the first fetchNextPage will skip this and get true, to get the rest.
      // unless there are no more members, in which case it'll return null and stop.
      // it'll return true that first time, so the next time lastPageParam is true, it'll return null and stop.
      if (lastPageParam || !hasMore) return null;
      return true;
    },
    initialData: { pages: [family.members], pageParams: [false] },
  });

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
                return <MemberCard key={member.id} member={member} isManager={isManager} />;
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
