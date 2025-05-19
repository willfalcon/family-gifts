import { notFound } from 'next/navigation';

import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import { getMember } from '@/lib/queries/members';
import MemberHeader from './MemberHeader';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const member = await getMember(id);
  return {
    title: `${member?.name}`,
    description: `Manage ${member?.name} on Family Gifts`,
    robots: {
      index: false,
    },
  };
}
export default async function MemberPage({ params }: Props) {
  const { id } = await params;
  const member = await getMember(id);
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

      {/* TODO: Add some stuff here or figure out what to do with this page */}
    </div>
  );
}
