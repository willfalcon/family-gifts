import { auth } from '@/auth';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getFamilies } from '@/lib/queries/families';

import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import Title, { SubTitle } from '@/components/Title';
import { buttonVariants } from '@/components/ui/button';
import FamiliesPage from './FamiliesPage';

export const metadata = {
  title: 'Families',
  description: 'Manage your family groups and invitations',
};

export default async function page() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const families = await getFamilies();

  return (
    <div className="container mx-auto px-4 py-8">
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Families', href: '/dashboard/families' },
        ]}
      />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <Title>Families</Title>
          <SubTitle>Manage your family groups and invitations</SubTitle>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/families/new" className={buttonVariants()}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Family
          </Link>
        </div>
      </div>

      <FamiliesPage families={families} userId={session.user.id} />
    </div>
  );
}
