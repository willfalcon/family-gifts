import Title from '@/components/Title';

import { getFamilyMembers } from '@/lib/queries/family-members';
import FamilyMembers from './FamilyMembers';

export default async function Family() {
  const initialData = await getFamilyMembers();

  return (
    <div className="space-y-4 p-8 pt-6">
      <Title>Family Members</Title>
      {initialData.success && initialData.lists && <FamilyMembers {...initialData} />}
    </div>
  );
}
