import { auth } from '@/auth';
import { Users2 } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getRelatedMembers } from '@/lib/queries/members';

import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import Title, { SubTitle } from '@/components/Title';
import { buttonVariants } from '@/components/ui/button';
import MembersList from './MembersList';

export default async function MembersPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in');
  }
  const members = await getRelatedMembers();

  return (
    <div className="container mx-auto px-4 py-8">
      <SetBreadcrumbs items={[{ name: 'Members', href: '/dashboard/members' }]} />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <Title>Members</Title>
          <SubTitle>View and connect with all your people</SubTitle>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/families" className={buttonVariants({ variant: 'outline' })}>
            <Users2 className="mr-2 h-4 w-4" />
            Manage Families
          </Link>
        </div>
      </div>
      <MembersList members={members} />
    </div>
  );
}
