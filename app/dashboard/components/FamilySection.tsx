import { buttonVariants } from '@/components/ui/button';
import { dashboardGetFamilies } from '@/lib/queries/families';
import Link from 'next/link';

import { Plus, Users } from 'lucide-react';
import FamilySectionFamily from './FamilySectionFamily';
import { Card } from '@/components/ui/card';

export default async function FamilySection() {
  const families = await dashboardGetFamilies();
  if (!families.length) {
    return (
      <Card className="border-dashed flex flex-col items-center justify-center p-8">
        <Users className="h-8 w-8 text-muted-foreground mb-4" />
        <h3 className="font-medium text-center mb-2">Create a new family</h3>
        <p className="text-sm text-muted-foreground text-center mb-4">Start a new family group and invite members</p>

        <Link href="/dashboard/families/new" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          New Family
        </Link>
      </Card>
    );
  }
  return (
    <section className="mb-10 col-span-2">
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
