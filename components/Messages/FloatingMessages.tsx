'use client';

import { MessagesSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { useSidebar } from '../ui/sidebar';
import { cn } from '@/lib/utils';

export default function FloatingMessages() {
  const { toggleSidebar, open } = useSidebar();
  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 transition-[right] ease-linear duration-200 will-change-auto',
        open ? 'right-[calc(var(--sidebar-width)+1rem)]' : 'right-4',
      )}
    >
      <Button variant="outline" className="rounded-full w-14 h-14" onClick={toggleSidebar}>
        <MessagesSquare className="w-full h-full" />
      </Button>
    </div>
  );
}
