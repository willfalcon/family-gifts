import ItemList from '@/app/dashboard/wish-list/ItemList';
import ListItem from '@/app/dashboard/wish-list/ListItem';
import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import Title from '@/components/Title';
import { buttonVariants } from '@/components/ui/button';
import { getFamilyMemberById } from '@/lib/queries/family-members';
import { getList } from '@/lib/queries/items';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

type PageProps = {
  params: {
    id: string;
  };
};

export default async function FamilyMemberList({ params }: PageProps) {
  const { member } = await getFamilyMemberById(params.id);
  if (!member) {
    return <p>Can&apos;t find this family member!</p>;
  }
  const { success, list, message } = await getList(params.id);
  const categories = list?.reduce<string[]>((acc, cur) => {
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
          { name: member.name, href: `/dashboard/family/list/${member.id}` },
        ]}
      />
      <Link href="/dashboard/family/" className={buttonVariants({ variant: 'ghost', className: 'mb-4' })}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Family Lists
      </Link>
      <Title>{member.name}&apos;s Lists</Title>
      {!success ? (
        <p>{message}</p>
      ) : (
        <div className="space-y-4">
          {categories?.map((category) => (
            <ItemList key={category} category={category}>
              {list?.filter((item) => item.category === category).map((item) => <ListItem key={item.id} {...item} categories={categories} />)}
            </ItemList>
          ))}
          <ItemList category="Other">
            {list?.filter((item) => !item.category).map((item) => <ListItem key={item.id} {...item} categories={categories || []} />)}
          </ItemList>
        </div>
      )}
    </div>
  );
}
