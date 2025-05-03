import { notFound } from 'next/navigation';

import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import { getMember } from '@/lib/queries/members';
import MemberHeader from './MemberHeader';

//todo: add a page for a single member
export default async function MemberPage({ params }: { params: { id: string } }) {
  const member = await getMember(params.id);
  if (!member) {
    notFound();
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <SetBreadcrumbs
        items={[
          { name: 'Members', href: '/dashboard/members' },
          ...(member.name ? [{ name: member.name, href: `/dashboard/members/${member.id}` }] : []),
        ]}
      />
      <MemberHeader member={member} />

      {/* Add some stuff here or figure out what to do with this page */}
    </div>
  );
}
