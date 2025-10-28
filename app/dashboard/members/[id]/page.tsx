import { notFound } from 'next/navigation';

import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import { SubTitle } from '@/components/Title';
import WishListCard from '@/components/WishListCard';
import { GetList } from '@/lib/queries/items';
import { getListsByMember } from '@/lib/queries/lists';
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
  const lists = await getListsByMember(id);
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

      <div>
        <SubTitle>Wish Lists</SubTitle>
        <div className="flex flex-wrap gap-2">
          {lists.map((list) => (
            <WishListCard key={list.id} list={list as GetList} />
          ))}
        </div>
      </div>
    </div>
  );
}
