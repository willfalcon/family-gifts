import { auth } from '@/auth';
import { ErrorMessage } from '@/components/ErrorMessage';
import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import Title from '@/components/Title';
import { getChannels } from '@/lib/queries/chat';
import { redirect } from 'next/navigation';
import ChannelsList from './ChannelsList';

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
      <div className="flex gap-4">
        <ChannelsList channels={channels} />
        {/* <Chat channel={channel} /> */}
      </div>
    </div>
  );
}
