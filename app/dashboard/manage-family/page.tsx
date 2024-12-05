import { auth } from '@/auth';

import { redirect } from 'next/navigation';
// import AddMember from "./AddMember";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NewFamily from './NewFamily';
import AddMember from './AddMember';
import MembersList from './MembersList';

import DeleteFamily from './DeleteFamily';
import { getActiveFamilyId } from '@/lib/rscUtils';
import { getFamilies } from '@/lib/queries/families';
import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import { getActiveMemberUser } from '@/lib/queries/family-members';
import { ErrorMessage } from '@/components/ErrorMessage';

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
  const isManager = family?.managers.some((manager) => manager.id === me.id) || false;

  return (
    <div className="space-y-4 p-8 pt-6">
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Manage Family', href: '/dashboard/manage-family' },
        ]}
      />
      {family && isManager && (
        <Card>
          <CardHeader>
            <CardTitle>{family.name}</CardTitle>
            <CardDescription>Add, remove, or update family members and their permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <AddMember family={family} />
          </CardContent>
        </Card>
      )}
      {family && (
        <>
          <MembersList family={family} isManager={isManager} />
          <Card>
            <CardHeader>
              <CardTitle>Family Settings</CardTitle>
            </CardHeader>
            <CardContent>{isManager && <DeleteFamily family={family} />}</CardContent>
          </Card>
        </>
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
