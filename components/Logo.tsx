import { Gift } from 'lucide-react';

import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2 py-2', className)}>
      <Gift className="h-6 w-6 text-primary flex-shrink-0 block ml-1" />
      <span className="font-bold text-xl block flex-shrink overflow-hidden whitespace-nowrap">Family Gifts</span>
    </div>
  );
}
