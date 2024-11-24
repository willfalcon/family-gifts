'use client';
import { ChevronDown, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Family } from '@prisma/client';
import { setActiveFamilyId } from '@/lib/utils';
import { useActiveFamilyContext } from '@/app/dashboard/Providers';
import { SidebarMenuButton } from './ui/sidebar';
import CreateFamily from './CreateFamily';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from './ui/skeleton';

type Props = {
  sidebar?: boolean;
};

export default function FamilySelect({ sidebar = false }: Props) {
  const [activeFamilyState, setActiveFamilyState] = useActiveFamilyContext();

  const { data, isLoading } = useQuery({
    queryKey: ['families'],
    queryFn: async () => fetch('/api/getFamilies').then((res) => res.json()),
  });

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="flex-1 h-6" />
      </div>
    );
  }

  const activeFamily = activeFamilyState ? data?.families.find((family: Family) => family.id === activeFamilyState) : data.families[0];
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
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {data?.families.map((family: Family) => (
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
    <CreateFamily />
  );
}
