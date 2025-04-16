import { User } from '@prisma/client';
import { CalendarDays, Share2, Users } from 'lucide-react';

import { RelationshipType } from './MembersList';

export const getRelationshipIcon = (type: RelationshipType) => {
  switch (type) {
    case 'family':
      return <Users className="h-4 w-4" />;
    case 'event':
      return <CalendarDays className="h-4 w-4" />;
    case 'list':
      return <Share2 className="h-4 w-4" />;
  }
};

// Function to determine if a member should be visible based on privacy settings
// In a real app, this would take into account the current user's relationship with the member
export const isVisible = (member: User, currentUserRelationships: RelationshipType[] = ['family', 'event', 'list']) => {
  //TODO: add privacy filter
  // switch (member.privacyLevel) {
  //   case PrivacyLevel.PUBLIC:
  //     return true
  //   case PrivacyLevel.FAMILY_AND_EVENTS:
  //     return currentUserRelationships.includes("family") || currentUserRelationships.includes("event")
  //   case PrivacyLevel.FAMILY_ONLY:
  //     return currentUserRelationships.includes("family")
  //   case PrivacyLevel.EVENTS_ONLY:
  //     return currentUserRelationships.includes("event")
  //   case PrivacyLevel.SHARED_LISTS_ONLY:
  //     return currentUserRelationships.includes("shared_list")
  //   case PrivacyLevel.NOBODY:
  //     return false
  //   default:
  //     return true
  // }
  return true;
};
