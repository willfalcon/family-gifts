import { JSONContent } from '@tiptap/react';
import { format } from 'date-fns';
import { Mail, MoreHorizontal, PenSquare, Share } from 'lucide-react';
import Link from 'next/link';

import { type GetFamily } from '@/lib/queries/families';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Title from '@/components/Title';
import { Badge } from '@/components/ui/badge';
import Viewer from '@/components/ui/rich-text/viewer';

type Props = {
  family: GetFamily;
  isManager: boolean;
};

export default function FamilyHeader({ family, isManager }: Props) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-2">
          <Title>{family.name}</Title>
          <Badge variant="outline">{family._count.members} members</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Created by {family.creator.name} • {format(family.createdAt, 'yyyyI-mm-dd')}
        </p>
        {family.description && <Viewer className="text-muted-foreground" content={family.description as JSONContent} immediatelyRender={false} />}
      </div>
      <div className="flex gap-2">
        {/* TODO: Add message all */}
        <Button variant="outline" size="sm">
          <Mail className="mr-2 h-4 w-4" />
          Message All
        </Button>
        {/* TODO: Add share */}
        <Button variant="outline" size="sm">
          <Share className="mr-2 h-4 w-4" />
          Share
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isManager && (
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/families/${family.id}/edit`}>
                  <PenSquare className="mr-2 h-4 w-4" />
                  Edit Family
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Message All
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Leave Family</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
