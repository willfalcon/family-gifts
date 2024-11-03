import { Prisma } from '@prisma/client';

export type FamilyMemberWithRefs = Prisma.FamilyMemberGetPayload<{
  include: {
    items: true;
    user: true;
  };
  select: {
    name: true;
    id: true;
  };
}>;

export type FamilyMemberWithUser = Prisma.FamilyMemberGetPayload<{
  include: {
    user: true;
  };
}>;

export type EventWithAssignments = Prisma.EventGetPayload<{
  include: {
    assignments: true;
  };
}>;

export type AssignmentWithRefs = Prisma.AssignmentGetPayload<{
  include: {
    giver: {
      include: {
        user: true;
      };
    };
    receiver: {
      include: {
        user: true;
      };
    };
  };
}>;

export type ItemWithMember = Prisma.ItemGetPayload<{
  include: {
    member: true;
  };
}>;
export type ItemWithRefs = Prisma.ItemGetPayload<{
  include: {
    member: true;
    boughtBy?: true;
  };
}>;
