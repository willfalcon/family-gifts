import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import Title from '@/components/Title';
import ProfileForm from './ProfileForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/queries/user';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in');
  }

  const user = await getUser(session.user?.id || '');

  return (
    <div className="space-y-4 p-8 pt-6">
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Profile', href: '/dashboard/profile' },
        ]}
      />
      <Title>Profile</Title>
      <ProfileForm user={user} />
    </div>
  );
}
