'use client';
import { ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Family } from '@prisma/client';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import NewFamily from '@/app/dashboard/manage-family/NewFamily';
import { useState } from 'react';
import { setActiveFamilyId } from '@/lib/utils';
import { useActiveFamilyContext } from '@/app/dashboard/Providers';
import { SidebarMenuButton } from './ui/sidebar';

type Props = {
  families: Family[];
  sidebar?: boolean;
};

export default function FamilySelect({ families, sidebar = false }: Props) {
  const [activeFamilyState, setActiveFamilyState] = useActiveFamilyContext();
  const activeFamily = activeFamilyState ? families.find((family) => family.id === activeFamilyState) : families[0];

  const [dialogOpen, setDialogOpen] = useState(false);

  return activeFamily ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {sidebar ? (
          <SidebarMenuButton size="lg" className="pl-0">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <span className="">{activeFamily.name.split('')[0]}</span>
            </div>
            <span>{activeFamily.name}</span>
            <ChevronDown className="ml-auto" />
          </SidebarMenuButton>
        ) : (
          <Button variant="ghost" className="px-2 font-bold text-2xl">
            {activeFamily.name}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        {families.map((family) => (
          <DropdownMenuItem
            key={family.id}
            onSelect={() => {
              setActiveFamilyId(family.id);
              setActiveFamilyState(family.id);
            }}
          >
            {family.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="px-2 font-bold text-2xl">
          Create a Family
        </Button>
      </DialogTrigger>
      <DialogContent>
        <NewFamily afterSubmit={() => setDialogOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
