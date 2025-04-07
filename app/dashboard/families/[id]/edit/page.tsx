import { auth } from '@/auth';
import Title from '@/components/Title';

import { getFamily } from '@/lib/queries/families';
import { redirect } from 'next/navigation';
import EditFamily from './EditFamily';

export default async function FamilyEditPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in');
  }

  const family = await getFamily(params.id);

  if (!family.managers.some((m) => m.id === session.user?.id)) {
    throw new Error('You must be a manager to edit this family');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Title>{family.name}</Title>
        </div>
      </div>

      <EditFamily family={family} />
    </div>
  );
}
