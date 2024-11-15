import { auth } from '@/auth';
import CreateFamily from '@/components/CreateFamily';
import GiftsBought from '@/components/Dashboard/GiftsBought';
// import MyList from '@/components/Dashboard/MyLIst';
import QuickActions from '@/components/Dashboard/QuickActions';
import TotalMembers from '@/components/Dashboard/TotalMembers';
import UpcomingEvents from '@/components/Dashboard/UpcomingEvents';
import Title from '@/components/Title';
import { getActiveFamilyId } from '@/lib/rscUtils';

import { redirect } from 'next/navigation';

export default async function page() {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const activeFamily = await getActiveFamilyId();

  return (
    <div className="space-y-4 p-8 pt-6">
      <Title>Dashboard</Title>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {activeFamily ? (
          <>
            <TotalMembers />
            <UpcomingEvents />
            {/* <MyList /> */}
            <GiftsBought />
            <QuickActions className="col-span-2" />
          </>
        ) : (
          <CreateFamily variant="default" />
        )}
      </div>
    </div>
  );
}
