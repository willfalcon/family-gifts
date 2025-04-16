import { notFound } from 'next/navigation';

import { getListForEdit } from '@/lib/queries/items';

import SetBreadcrumbs from '@/components/SetBreadcrumbs';
import Title, { SubTitle } from '@/components/Title';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EditList from './EditList';
import ListItemsForm from './ListItemsForm';

export default async function EditListPage({ params }: { params: { id: string } }) {
  const list = await getListForEdit(params.id);

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
        </TabsList>
        <TabsContent value="details">
          <EditList list={list} />
        </TabsContent>
        <TabsContent value="items">
          <ListItemsForm list={list} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
