'use client';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import useViewMode from './useViewMode';

export default function ViewModeToggle() {
  const [viewMode, setViewMode] = useViewMode();

  return (
    <div className="flex rounded-md border">
      <Button variant={viewMode === 'detailed' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('detailed')} className="rounded-r-none">
        <LayoutGrid className="h-4 w-4 mr-2" />
        Detailed
      </Button>
      <Button variant={viewMode === 'compact' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('compact')} className="rounded-l-none">
        <List className="h-4 w-4 mr-2" />
        Compact
      </Button>
    </div>
  );
}
