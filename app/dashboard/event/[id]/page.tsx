import { auth } from '@/auth';
import Title from '@/components/Title';
import { getActiveFamilyId } from '@/lib/rscUtils';
import { format } from 'date-fns';
import { redirect } from 'next/navigation';
import Manager from '../../secret-santa/Manager';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Viewer from '@/components/ui/rich-text/viewer';
import { JSONContent } from '@tiptap/react';
import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import { getEvent } from '@/lib/queries/events';
import { getFamilies } from '@/lib/queries/families';

type PageProps = {
  params: {
    id: string;
  };
};

export default async function EventPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in');
  }
  const { event, success, message } = await getEvent(params.id);
  if (!success || !event) {
    return <p>{message}</p>;
  }

  const activeFamilyId = await getActiveFamilyId();
  const { families } = await getFamilies();
  const family = activeFamilyId ? families.find((family) => family.id === activeFamilyId) : families[0];
  const isManager = family?.managerId === session.user.id;

  return (
    <div className="space-y-4 p-8 pt-6">
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Events', href: '/dashboard/events' },
          { name: event.name, href: `/dashboard/event/${event.id}` },
        ]}
      />
      <Title>{event.name}</Title>
      {event.date && <p className="text-sm text-muted-foreground">{format(event.date, 'MMMM dd, yyyy')}</p>}
      {event.info && <Viewer content={event.info as JSONContent} style="prose" />}
      {isManager && family && !!event.assignments.length && <Manager familyId={family.id} eventId={event.id} assignments={event.assignments} />}
      {isManager && family && !event.assignments.length && (
        <Dialog>
          <DialogTrigger asChild>
            <Button>Set Up Secret Santa</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Secret Santa Setup</DialogTitle>
              <DialogDescription>{`Set who's participating and other settings.`}</DialogDescription>
            </DialogHeader>
            <Manager familyId={family.id} eventId={event.id} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
