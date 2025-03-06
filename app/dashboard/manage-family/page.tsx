import { auth } from '@/auth';

import { redirect } from 'next/navigation';
// import AddMember from "./AddMember";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NewFamily from './NewFamily';

import { getActiveFamilyId } from '@/lib/rscUtils';
import { getFamilies } from '@/lib/queries/families';
import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import { getActiveMemberUser } from '@/lib/queries/family-members';
import { ErrorMessage } from '@/components/ErrorMessage';
import FamilyCards from './FamilyCards';

import { getMembers } from '../event/[id]/actions';

export default async function ManageFamily() {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const { families } = await getFamilies();

  const activeFamilyId = await getActiveFamilyId();
  const family = activeFamilyId ? families.find((family) => family.id === activeFamilyId) : families[0];
  const me = await getActiveMemberUser();
  if (!me) {
    return <ErrorMessage title="Couldn't find active member." />;
  }
  
  const { success, members, message } = family ? await getMembers(family.id) : { success: false, members: [], message: 'No family found' };

  return (
    <div className="space-y-4 p-8 pt-6">
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Manage Family', href: '/dashboard/manage-family' },
        ]}
      />
      {family && (
        <FamilyCards family={family} me={me} success={success} members={members} message={message} />
      )}
      <Card>
        <CardHeader>
          <CardTitle>Create a new Family</CardTitle>
        </CardHeader>
        <CardContent>
          <NewFamily />
        </CardContent>
      </Card>
    </div>
  );
}
