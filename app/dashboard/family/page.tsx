import Title from '@/components/Title';

import { getFamilyMemberLists } from '@/prisma/queries';
import FamilyLists from './FamilyLists';

export default async function Family() {
  const initialData = await getFamilyMemberLists();

  return (
    <div className="space-y-4 p-8 pt-6">
      <Title>Family Members</Title>
      {initialData.success && initialData.lists && <FamilyLists {...initialData} />}
    </div>
  );
}
