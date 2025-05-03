import { Menu } from 'lucide-react';
import HeaderBreadcrumbs from './HeaderBreadcrumbs';
import Logo from './Logo';
import { Separator } from './ui/separator';
import { SidebarTrigger } from './ui/sidebar';

export default async function Header() {
  return (
    <>
      <header className="md:h-16 md:flex justify-between md:justify-start items-center gap-2 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-16">
        <div className="flex items-center justify-between gap-x-2 border-b md:border-none h-16 bg-background">
          <SidebarTrigger className="order-2 md:order-1 justify-self-end" mobileIcon={<Menu className="md:hidden" />} />
          <Separator orientation="vertical" className="mr-2 h-4 hidden md:block md:order-2" />
          <Logo className="order-1 md:hidden" />
        </div>
        <HeaderBreadcrumbs className="flex-basis-full w-full md:flex-basis-auto order-2 md:order-1 pt-2 md:pt-0" />
        {/* <FamilySelect families={families} /> */}
        {/* <UserButton /> */}
      </header>
    </>
  );
}
