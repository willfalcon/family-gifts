import Title, { SubTitle } from '@/components/Title';

import NewEvent from './NewEvent';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function NewEventPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Title>Create New Event</Title>
        <SubTitle>Set up a new gift-giving occasion</SubTitle>
      </div>

      <NewEvent />
    </div>
  );
}
