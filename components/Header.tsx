import HeaderBreadcrumbs from './HeaderBreadcrumbs';
import Logo from './Logo';
import { Separator } from './ui/separator';
import { SidebarTrigger } from './ui/sidebar';

export default async function Header() {
  return (
    <header className="flex md:h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex flex-wrap md:flex-nowrap items-center gap-x-2 px-4">
        <SidebarTrigger className="order-1" />
        <Separator orientation="vertical" className="mr-2 h-4 order-1 md:order-1" />
        <HeaderBreadcrumbs className="flex-basis-full w-full md:flex-basis-auto order-2 md:order-1" />
        <Logo className="order-1 md:hidden" />
        {/* <FamilySelect families={families} /> */}
        {/* <UserButton /> */}
      </div>
    </header>
  );
}
