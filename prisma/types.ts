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
export type FamilyMemberWithFamily = Prisma.FamilyMemberGetPayload<{
  include: {
    family: true;
  };
}>;

export type FamilyMemberWithUser = Prisma.FamilyMemberGetPayload<{
  include: {
    user: true;
  };
}>;

export type EventWithAssignments = Prisma.EventGetPayload<{
  include: {
    assignments: {
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
    };
  };
}>;
export type EventWithFamily = Prisma.EventGetPayload<{
  include: {
    family: true;
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

export type ListWithItems = Prisma.ListGetPayload<{
  include: {
    visibleTo: true;
    items: {
      include: {
        member: true;
        boughtBy?: true;
      };
    };
  };
}>;
