import { auth } from '@/auth';
import { SubTitle } from '@/components/Title';

import Title from '@/components/Title';
import { redirect } from 'next/navigation';
import NotificationsPage from './NotificationsPage';

export default async function page() {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in');
  }
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Title>Notifications</Title>
        <SubTitle>Stay updated with your family gift activities.</SubTitle>
      </div>

      <NotificationsPage />
    </div>
  );
}
