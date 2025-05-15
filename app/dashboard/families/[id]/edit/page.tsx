import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getFamily } from '@/lib/queries/families';

import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import Title, { SubTitle } from '@/components/Title';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DangerZone from './components/DangerZone';
import EditFamily from './components/EditFamily';
import EditFamilyMembers from './components/Members';

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props) {
  const family = await getFamily(params.id);
  return {
    title: `Edit ${family?.name}`,
    description: `Edit ${family?.name} on Family Gifts`,
    robots: {
      index: false,
    },
  };
}

export default async function FamilyEditPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in');
  }

  if (!session.user.id) {
    throw new Error('User ID is not set');
  }

  const family = await getFamily(params.id);

  if (!family.managers.some((m) => m.id === session.user?.id)) {
    throw new Error('You must be a manager to edit this family');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SetBreadcrumbs
        items={[
          { name: 'Families', href: '/dashboard/families' },
          { name: family.name, href: `/dashboard/families/${family.id}` },
          { name: 'Edit', href: `/dashboard/families/${family.id}/edit` },
        ]}
      />
      <div className="mb-6">
        <Title>Edit Family</Title>
        <SubTitle>Manage your family settings and members</SubTitle>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          {/* <TabsTrigger value="privacy">Privacy & Access</TabsTrigger> */}
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <EditFamily family={family} />
        </TabsContent>
        <TabsContent value="members">
          <EditFamilyMembers family={family} userId={session.user.id} />
        </TabsContent>
        {/* <TabsContent value="privacy">
          <FamilyPrivacy family={family} />
        </TabsContent> */}
        <TabsContent value="danger">
          <DangerZone family={family} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
