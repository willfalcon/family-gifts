import { getUser } from '@/app/actions';
import { auth } from '@/auth';
import Title, { SubTitle } from '@/components/Title';
import { randomBytes } from 'crypto';
import { redirect } from 'next/navigation';
import NewListForm from './NewListForm';

export const metadata = {
  title: 'New Wish List',
  description: 'Create a new wish list to share with your family and friends.',
};

export default async function NewWishlistPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }
  const user = await getUser(session.user.id);
  const shareLinkId = randomBytes(4).toString('hex');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Title>Create New Wish List</Title>
        <SubTitle>Add items you'd like to receive as gifts.</SubTitle>
      </div>

      <NewListForm user={user} shareLinkId={shareLinkId} />
    </div>
  );
}
