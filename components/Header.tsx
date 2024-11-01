import { getActiveFamilyId } from '@/lib/rscUtils';
// import FamilySelect from './FamilySelect';

// import UserButton from './UserButton';
import { getFamilies } from '@/prisma/queries';
import { setActiveFamilyId } from '@/lib/utils';
import { SidebarTrigger } from './ui/sidebar';
import { Separator } from './ui/separator';
import HeaderBreadcrumbs from './HeaderBreadcrumbs';

export default async function Header() {
  const activeFamilyId = getActiveFamilyId();
  const { families } = await getFamilies();
  if (!activeFamilyId) {
    if (families) {
      setActiveFamilyId(families[0].id);
    }
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <HeaderBreadcrumbs />
        {/* <FamilySelect families={families} /> */}
        {/* <UserButton /> */}
      </div>
    </header>
  );
}
