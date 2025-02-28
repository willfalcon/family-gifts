import Title from '@/components/Title';

import { getActiveMemberUser, getFamilyMembers } from '@/lib/queries/family-members';
import FamilyMembers from './FamilyMembers';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import FloatingMessages from '@/components/Messages/FloatingMessages';
import { SidebarProvider } from '@/components/ui/sidebar';
import MessagesSidebar from '@/components/Messages/MessagesSidebar';
import { getFamilyChannel } from '@/lib/queries/chat';
import { ErrorMessage } from '@/components/ErrorMessage';

export default async function Family() {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const initialData = await getFamilyMembers();

  const me = await getActiveMemberUser();
  if (!me) {
    return <ErrorMessage title="Couldn't find active member." />;
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="space-y-4 p-8 pt-6 relative w-full">
        <Title>Family Members</Title>
        {initialData.success && initialData.lists && <FamilyMembers {...initialData} />}
        <FloatingMessages />
      </div>
      <MessagesSidebar familyId={me.familyId} session={session} />
    </SidebarProvider>
  );
}
