'use client';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { PropsWithChildren, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

type Props = PropsWithChildren & {
  category: string;
};

export default function ItemList({ category, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible key={category} open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {category}
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-4">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}
