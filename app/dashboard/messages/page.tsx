import { auth } from '@/auth';
import { redirect } from 'next/navigation';

import Messages from './Messages';

export const metadata = {
  title: 'Messages',
  description: 'Send and receive messages from your family and friends',
  robots: {
    index: false,
  },
};

export default async function MessagePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  return <Messages session={session} />;
}
