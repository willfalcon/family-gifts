'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import { Item, User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useActiveFamilyContext } from '../components/Providers';
import Link from 'next/link';
import { useBreadcrumbs } from '@/components/HeaderBreadcrumbs';

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
  message: string;
};

async function queryFn(): Promise<Props> {
  return fetch('/api/getFamilyMembers').then((res) => res.json());
}

export default function FamilyMembers(initialData: Props) {
  const [activeFamilyId] = useActiveFamilyContext();
  const { data } = useQuery({ queryKey: ['familyMembers', activeFamilyId], queryFn, initialData: initialData });

  const setBreadcrumbs = useBreadcrumbs();
  setBreadcrumbs([
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Family', href: '/dashboard/family' },
  ]);

  return (
    <div>
      {data.lists && (
        <div className="grid grid-cols-2 gap-4">
          {data.lists.map((member) => (
            <Link
              key={member.id}
              className={buttonVariants({ variant: 'outline', className: 'h-auto py-4 flex items-center justify-start' })}
              href={`/dashboard/family/${member.id}`}
            >
              <Avatar className="mr-2">
                <AvatarImage src={member.user?.image || undefined} alt={member.name} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
              {member.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
