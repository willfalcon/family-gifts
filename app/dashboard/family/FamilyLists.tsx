'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import { Item, User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useActiveFamilyContext } from '../Providers';
import Link from 'next/link';
import { useBreadcrumbs } from '@/components/HeaderBreadcrumbs';
// import { FamilyMemberWithRefs } from "@/prisma/types";

type Props = {
  success: boolean;
  lists:
    | {
        name: string;
        id: string;
        items?: Item[] | null;
        user?: User | null;
      }[]
    | null;
};

async function queryFn(): Promise<Props> {
  return fetch('/api/getFamilyMemberLists').then((res) => res.json());
}

export default function FamilyLists(initialData: Props) {
  const [activeFamilyId] = useActiveFamilyContext();
  const { data } = useQuery({ queryKey: ['familyLists', activeFamilyId], queryFn, initialData: initialData });

  const setBreadcrumbs = useBreadcrumbs();
  setBreadcrumbs([
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Family', href: '/dashboard/family' },
  ]);

  return (
    data.lists && (
      <div className="grid grid-cols-2 gap-4">
        {data.lists.map((member) => (
          <Link
            key={member.id}
            className={buttonVariants({ variant: 'outline', className: 'h-auto py-4 flex items-center justify-start' })}
            href={`/dashboard/family/list/${member.id}`}
          >
            <Avatar className="mr-2">
              <AvatarImage src={member.user?.image || undefined} alt={member.name} />
              <AvatarFallback>{member.name[0]}</AvatarFallback>
            </Avatar>
            {member.name}&apos;s List
          </Link>
        ))}
      </div>
    )
  );
}
