import { auth } from '@/auth';
import { redirect } from 'next/navigation';

import Messages from '../Messages';

type Props = { params: Promise<{ channelId: string }> };

export default async function MessagePage({ params }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const { channelId } = await params;
  return <Messages session={session} channelId={channelId} />;
}
