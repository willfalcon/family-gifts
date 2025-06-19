import { notFound } from 'next/navigation';

import { getListForEdit } from '@/lib/queries/items';

import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import Title, { SubTitle } from '@/components/Title';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DeleteList from './DeleteList';
import EditList from './EditList';
import ListItemsForm from './ListItemsForm';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const list = await getListForEdit(id);
  return {
    title: `Edit ${list?.name}`,
    description: `Edit ${list?.name} on Family Gifts`,
    robots: {
      index: false,
    },
  };
}

//TODO: add delete list
export default async function EditListPage({ params }: Props) {
  const { id } = await params;
  const list = await getListForEdit(id);

  if (!list) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SetBreadcrumbs
        items={[
          { name: 'Wish Lists', href: '/dashboard/wish-lists' },
          { name: list.name, href: `/dashboard/wish-lists/${list.id}` },
          { name: 'Edit', href: `/dashboard/wish-lists/${list.id}/edit` },
        ]}
      />
      <div className="mb-6">
        <Title>Edit List</Title>
        <SubTitle>Update your wish list details and items</SubTitle>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="danger-zone">Danger Zone</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <EditList list={list} />
        </TabsContent>
        <TabsContent value="items">
          <ListItemsForm list={list} />
        </TabsContent>
        <TabsContent value="danger-zone">
          <DeleteList list={list} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
