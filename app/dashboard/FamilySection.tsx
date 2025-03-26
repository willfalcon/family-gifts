import { buttonVariants } from '@/components/ui/button';
import { dashboardGetFamilies } from '@/lib/queries/families';
import Link from 'next/link';

import { Users } from 'lucide-react';
import FamilySectionFamily from './FamilySectionFamily';

export default async function FamilySection() {
  const families = await dashboardGetFamilies();

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Family Members</h2>
        <Link href="/dashboard/families" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
          <Users className="mr-2 h-4 w-4" />
          Manage Families
        </Link>
      </div>
      {families.map((family) => (
        <FamilySectionFamily key={family.id} family={family} />
      ))}
    </section>
  );
}
