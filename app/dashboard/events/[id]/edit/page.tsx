import { auth } from '@/auth';
import { redirect } from 'next/navigation';

import { getEvent } from '@/lib/queries/events';

import Title, { SubTitle } from '@/components/Title';
import UpdateEvent from './UpdateEvent';

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props) {
  const event = await getEvent(params.id);
  return {
    title: `Edit ${event?.name}`,
    description: `Edit ${event?.name} on Family Gifts`,
    robots: {
      index: false,
    },
  };
}

export default async function EditEventPage({ params }: Props) {
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
