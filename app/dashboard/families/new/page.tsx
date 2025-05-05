import Title, { SubTitle } from '@/components/Title';
import NewFamily from './NewFamily';

export const metadata = {
  title: 'New Family',
  description: 'Create a new family to group people together.',
};

export default function NewFamilyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <Title>New Family</Title>
          <SubTitle>Create a new family to group people together.</SubTitle>
        </div>
      </div>
      <NewFamily />
    </div>
  );
}
