import { auth } from '@/auth';
import { ErrorMessage } from '@/components/ErrorMessage';
import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import Title from '@/components/Title';
import { getChannel, getChannels } from '@/lib/queries/chat';
import { redirect } from 'next/navigation';
import ChannelsList from '../ChannelsList';
import Chat from '../Chat';
import { getActiveMemberAll } from '@/lib/queries/family-members';
import ChatProviders from '../ChatProviders';

export default async function ChannelPage({ params }: { params: { channelId: string } }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const { channels, success, message } = await getChannels();
  if (!success || !channels) {
    return <ErrorMessage title={message} />;
  }

  const { channel, success: channelSuccess, message: channelMessage } = await getChannel(params.channelId);

  if (!channelSuccess || !channel) {
    return <ErrorMessage title={channelMessage} />;
  }

  const me = await getActiveMemberAll();
  if (!me) {
    <ErrorMessage title="Couldn't find active member." />;
  }

  return (
    <div className="space-y-4 p-8 pt-6">
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Messages', href: '/dashboard/messages' },
          { name: channel.name, href: `/dashboard/messages/${channel.id}` },
        ]}
      />
      <Title>Messages</Title>
      <div className="flex gap-4">
        <ChannelsList channels={channels} />
        <ChatProviders defaultChannel={channels[0]}>
          <Chat channel={channel} me={me!} />
        </ChatProviders>
      </div>
    </div>
  );
}
