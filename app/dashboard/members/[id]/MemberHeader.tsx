import { JSONContent } from '@tiptap/react';
import { Mail, Share2 } from 'lucide-react';

import { GetMember } from '@/lib/queries/members';
import { formatDate } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Viewer from '@/components/ui/rich-text/viewer';

export default function MemberHeader({ member }: { member: GetMember }) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <Avatar className="h-24 w-24">
          <AvatarImage src={member.image || undefined} alt={member.name || undefined} />
          <AvatarFallback className="text-2xl">
            {member.name
              ?.split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{member.name}</h1>
                {/* <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={`h-3 w-3 rounded-full ${privacyInfo.color}`}></div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="flex items-center gap-1">
                        {privacyInfo.icon}
                        <span>{privacyInfo.label}</span>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider> */}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-muted-foreground">{member.email}</span>
              </div>
              <p className="text-muted-foreground mt-2">Joined {formatDate(member.createdAt)}</p>
            </div>

            <div className="flex gap-2">
              <Button>
                <Mail className="mr-2 h-4 w-4" />
                Message
              </Button>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {member.bio && <Viewer className="mt-4" content={member.bio as JSONContent} />}

          {/* <div className="mt-4">
            <div className="text-sm font-medium mb-2">Connections:</div>
            <div className="flex flex-wrap gap-2">
              {member.relationships.map((rel, idx) => (
                <TooltipProvider key={idx}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getRelationshipIcon(rel.type)}
                        <span>{rel.name}</span>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      {rel.type === 'family' && 'Family Member'}
                      {rel.type === 'event' && 'Event Attendee'}
                      {rel.type === 'shared_list' && 'Shared List'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
