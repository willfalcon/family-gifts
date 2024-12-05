import { auth } from '@/auth';
import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import Title from '@/components/Title';

import { redirect } from 'next/navigation';
import ChatPage from './ChatPage';
import ChatProviders from './ChatProviders';
import { getChannels } from '@/lib/queries/chat';
import { ErrorMessage } from '@/components/ErrorMessage';

export default async function MessagePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const { channels, success, message } = await getChannels();

  if (!success || !channels) {
    return <ErrorMessage title={message} />;
  }

  return (
    <div className="space-y-4 p-8 pt-6">
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Messages', href: '/dashboard/messages' },
        ]}
      />
      <Title>Messages</Title>
      <ChatProviders defaultChannel={channels[0]}>
        <ChatPage channels={channels} />
      </ChatProviders>
    </div>
  );
}
