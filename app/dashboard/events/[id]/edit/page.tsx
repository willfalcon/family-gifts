import { SubTitle } from '@/components/Title';

import Title from '@/components/Title';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getEvent } from '@/lib/queries/events';
import UpdateEvent from './UpdateEvent';
export default async function EditEventPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in');
  }
  const event = await getEvent(params.id);
  if (!event) {
    redirect('/dashboard/events');
  }
  if (event.creatorId !== session.user.id) {
    throw new Error('You are not authorized to edit this event');
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Title>Edit Event</Title>
          <SubTitle>Update event details and participants</SubTitle>
        </div>

        <UpdateEvent event={event} />
      </div>
    </div>
  );
}
