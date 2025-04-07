import Title, { SubTitle } from '@/components/Title';
import NewListForm from './NewListForm';

export default function NewWishlistPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Title>Create New Wish List</Title>
        <SubTitle>Add items you'd like to receive as gifts.</SubTitle>
      </div>

      <NewListForm />
    </div>
  );
}
