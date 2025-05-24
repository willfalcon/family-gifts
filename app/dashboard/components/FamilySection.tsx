import { Plus, Users } from 'lucide-react';
import Link from 'next/link';

import { dashboardGetFamilies } from '@/lib/queries/families';

import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import FamilySectionFamily from './FamilySectionFamily';

export default async function FamilySection() {
  const families = await dashboardGetFamilies();

  return (
    <section className="@container space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Family Members</h2>
        <Link href="/dashboard/families" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
          <Users className="mr-2 h-4 w-4" />
          Manage Families
        </Link>
      </div>
      <div className="space-y-6">
        {families.map((family) => (
          <FamilySectionFamily key={family.id} family={family} />
        ))}
      </div>
      {!families.length && (
        <Card className="border-dashed flex flex-col items-center justify-center p-8">
          <Users className="h-8 w-8 text-muted-foreground mb-4" />
          <h3 className="font-medium text-center mb-2">Create a new family</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">Start a new family group and invite members</p>

          <Link href="/dashboard/families/new" className={buttonVariants()}>
            <Plus className="mr-2 h-4 w-4" />
            New Family
          </Link>
        </Card>
      )}
    </section>
  );
}
