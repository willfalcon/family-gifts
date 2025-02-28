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

// export type FamilyMemberWithUser = Prisma.FamilyMemberGetPayload<{
//   include: {
//     user: true;
//   };
// }>;

// export type FamilyMemberWithUser = FamilyMember & {
//   user: User;
// };
export type FamilyMemberWithUser = Prisma.FamilyMemberGetPayload<{
  include: {
    user: true;
  };
}>;

export type FamilyMemberWithAll = Prisma.FamilyMemberGetPayload<{
  include: {
    user: true;
    managing: true;
    eventsManaged: true;
    giving: {
      include: {
        receiver: true;
      };
    };
  };
}>;

export type FamilyMemberWithManaging = Prisma.FamilyMemberGetPayload<{
  include: {
    user: true;
    managing: true;
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
    list?: true;
  };
}>;

export type ListWithItems = Prisma.ListGetPayload<{
  include: {
    visibleTo: true;
    items: {
      include: {
        member: true;
        boughtBy?: true;
        list?: true;
      };
    };
  };
}>;

// export type ChannelWithMessages = Channel & {
//   messages: MessageType[];
// };
export type ChannelWithMessagesReadyBy = Prisma.ChannelGetPayload<{
  include: {
    messages: true;
  };
}>;

export type ChannelWithType = Prisma.ChannelGetPayload<{
  include: {
    groupMembers?: true;
    family?: true;
    event?: true;
  };
}>;

export type ChannelWithRefs = Prisma.ChannelGetPayload<{
  include: {
    groupMembers?: true;
    family?: true;
    event?: true;
    messages: {
      include: {
        sender: {
          include: {
            user: true;
          };
        };
      };
    };
  };
}>;

export type MessageWithSender = Prisma.MessageGetPayload<{
  include: {
    sender: {
      include: {
        user: true;
        managing: true;
      };
    };
  };
}>;

// export type MessageType =
//   | {
//       id: string;
//       sender: FamilyMemberWithUserManaging;
//       channel: ChannelWithMessages;
//       text: string;
//       createdAt: Date;
//     }
//   | (Message & {
//       sender: FamilyMemberWithUserManaging;
//       channel: ChannelWithMessages;
//     });
