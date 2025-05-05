import { Gift } from 'lucide-react';
import { notFound, redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getEvent } from '@/lib/queries/events';

import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import Title, { SubTitle } from '@/components/Title';
import SecretSanta from './SecretSanta';

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props) {
  const event = await getEvent(params.id);
  return {
    title: `Secret Santa for ${event?.name}`,
    description: `Manage Secret Santa for ${event?.name} on Family Gifts`,
  };
}

export default async function SecretSantaPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in');
  }

  const event = await getEvent(params.id);

  if (!event) {
    notFound();
  }

  if (!event.managers.some((manager) => manager.id === session.user?.id)) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SetBreadcrumbs
        items={[
          { name: 'Events', href: '/dashboard/events' },
          { name: event.name, href: `/dashboard/events/${event.id}` },
          { name: 'Secret Santa', href: `/dashboard/events/${event.id}/secret-santa` },
        ]}
      />
      <div className="mb-6 flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Gift className="h-6 w-6 text-primary" />
        </div>
        <div>
          <Title>Secret Santa Manager</Title>
          <SubTitle>Set up the Secret Santa exchange for {event.name}</SubTitle>
        </div>
      </div>

      <SecretSanta event={event} />
    </div>
  );
}
