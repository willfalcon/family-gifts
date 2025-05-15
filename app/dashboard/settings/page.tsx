import { auth } from '@/auth';
import { User } from '@prisma/client';
import { redirect } from 'next/navigation';
import { cache } from 'react';

import { getUser as getUserQuery } from '@/lib/queries/user';

import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import Title, { SubTitle } from '@/components/Title';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChangePassword from './components/ChangePassword';
import PrivacySettings from './components/PrivacySettings';
import ProfileSettings from './components/ProfileForm';

const getUser = cache(async (id: User['id']) => {
  return await getUserQuery(id);
});

export const metadata = {
  title: 'Settings',
  description: 'Manage your account settings and preferences',
  robots: {
    index: false,
  },
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in');
  }

  const user = await getUser(session.user?.id || '');

  return (
    <div className="container px-4 py-8 max-w-screen-lg">
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Settings', href: '/dashboard/settings' },
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
          <>
            <ProfileSettings user={user} />
            <ChangePassword hasPassword={!!user.password} />
          </>
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
