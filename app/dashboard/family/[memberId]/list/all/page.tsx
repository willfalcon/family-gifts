import { ErrorMessage } from '@/components/ErrorMessage';

import WishList from '@/components/Lists/WishList';
import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import Title from '@/components/Title';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { getFamilyMemberById } from '@/lib/queries/family-members';
import { getListAll } from '@/lib/queries/items';

type PageProps = {
  params: {
    memberId: string;
  };
};

export default async function AllItemsList({ params }: PageProps) {
  const { member, message, success } = await getFamilyMemberById(params.memberId);
  if (!success || !member) {
    return <ErrorMessage title={message} />;
  }
  const { success: listSuccess, items, message: listMessage } = await getListAll(params.memberId);
  if (!listSuccess || !items) {
    return <ErrorMessage title={listMessage} />;
  }
  const categories = items.reduce<string[]>((acc, cur) => {
    if (cur.category) {
      if (!acc.includes(cur.category)) {
        acc.push(cur.category);
      }
    }
    return acc;
  }, []);

  return (
    <div className="space-y-4 p-8 pt-6">
      <SetBreadcrumbs
        items={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Family', href: '/dashboard/family' },
          { name: member.name, href: `/dashboard/family/${member.id}` },
          { name: 'All', href: `/dashboard/family/list/all` },
        ]}
      />
      <div className="flex space-x-4 items-center">
        <Avatar>
          <AvatarImage src={member.user?.image || undefined} alt={member.name} />
          <AvatarFallback>{member.name[0]}</AvatarFallback>
        </Avatar>
        <p className="text-muted-foreground">{member.name}</p>
      </div>
      <Title>All Items</Title>
      <WishList items={items} categories={categories} all />
    </div>
  );
}
