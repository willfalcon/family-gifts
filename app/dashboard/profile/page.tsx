import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import Title from '@/components/Title';
import ProfileForm from './ProfileForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getActiveMember } from '@/lib/queries/family-members';
import { ErrorMessage } from '@/components/ErrorMessage';
import FamilySelect from '@/components/FamilySelect';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in');
  }
  const me = await getActiveMember();

  if (!me) {
    return (
      <ErrorMessage title="You must be in a family to see this page. Try changing your active family?">
        <FamilySelect />
      </ErrorMessage>
    );
  }
  return (
    <div className="space-y-4 p-8 pt-6">
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Profile', href: '/dashboard/profile' },
        ]}
      />
      <Title>Profile</Title>
      <ProfileForm profile={me} />
    </div>
  );
}
