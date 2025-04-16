import { auth } from '@/auth';
import { redirect } from 'next/navigation';

import { getUser } from '@/lib/queries/user';

import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import Title, { SubTitle } from '@/components/Title';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PrivacySettings from './components/PrivacySettings';
import ProfileSettings from './components/ProfileForm';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in');
  }

  const user = await getUser(session.user?.id || '');

  return (
    <div className="container mx-auto px-4 py-8">
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Profile', href: '/dashboard/profile' },
        ]}
      />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <Title>Settings</Title>
          <SubTitle>Manage your account settings and preferences</SubTitle>
        </div>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {/* <TabsTrigger value="notifications">Notifications</TabsTrigger> */}
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <ProfileSettings user={user} />
        </TabsContent>
        {/* <TabsContent value="notifications" className="space-y-4"> */}
        {/* <NotificationsForm user={user} /> */}
        {/* </TabsContent> */}
        <TabsContent value="privacy" className="space-y-4">
          <PrivacySettings user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
