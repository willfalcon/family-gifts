import { auth } from '@/auth';
import { redirect } from 'next/navigation';

import Messages from '../Messages';

type Props = { params: { channelId: string } };

export default async function MessagePage({ params }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  return <Messages session={session} channelId={params.channelId} />;
}
