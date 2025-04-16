import { JSONContent } from '@tiptap/react';
import { format } from 'date-fns';
import { Mail, MoreHorizontal, PenSquare } from 'lucide-react';
import Link from 'next/link';

import { type GetFamily } from '@/lib/queries/families';

import { ShareButton } from '@/components/ShareButton';
import Title from '@/components/Title';
import MessageDialog from '@/components/messages/MessageDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Viewer from '@/components/ui/rich-text/viewer';
import { GetUser } from '@/lib/queries/user';
import RemoveSelf from '../edit/components/RemoveSelf';
type Props = {
  family: GetFamily;
  isManager: boolean;
  me: GetUser;
};

export default function FamilyHeader({ family, isManager, me }: Props) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-2">
          <Title>{family.name}</Title>
          <Badge variant="outline">
            {family._count.members} member{family._count.members === 1 ? '' : 's'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Created by {family.creator.name} • {format(family.createdAt, 'yyyyI-mm-dd')}
        </p>
        {family.description && <Viewer className="text-muted-foreground" content={family.description as JSONContent} immediatelyRender={false} />}
      </div>
      <div className="flex gap-2">
        {/* TODO: Add message all */}
        <MessageDialog
          trigger={
            <Button variant="outline" size="sm">
              <Mail className="mr-2 h-4 w-4" />
              Message All
            </Button>
          }
          user={me.id}
          familyId={family.id}
        />
        {/* <Button variant="outline" size="sm">
          <Mail className="mr-2 h-4 w-4" />
          Message All
        </Button> */}
        <ShareButton />
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
            <DropdownMenuItem className="text-destructive" asChild>
              <RemoveSelf family={family} trigger={<Button variant="ghost">Leave Family</Button>} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
