import { auth } from '@/auth';

import { redirect } from 'next/navigation';

export default async function SecretSanta() {
  redirect('/dashboard/events');

  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }
  // const activeFamilyId = getActiveFamilyId();
  // const { families } = await getFamilies();
  // const family = activeFamilyId ? families.find(family => family.id === activeFamilyId) : families[0];
  // const isManager = family?.managerId === session.user.id;

  return null;
  // return (
  // <div className="space-y-4 p-8 pt-6">
  //   {family ? (
  //     isManager ? (
  // <Manager familyId={family.id} />
  // ) : (
  // <Member />
  // )
  // ) : (
  // <p>Create a family.</p>
  // )}
  // </div>
  // );
}
