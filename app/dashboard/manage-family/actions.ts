'use server';

import { auth } from '@/auth';
import { FamilyMemberSchema, FamilyMemberSchemaType } from './familyMemberSchema';
import { prisma } from '@/prisma';
import { FamilySchema, FamilySchemaType } from './familySchema';
import { revalidatePath } from 'next/cache';
import { Family, FamilyMember } from '@prisma/client';
import InviteEmailTemplate from '@/emails/invite';
import { Resend } from 'resend';
import { randomBytes } from 'crypto';
import { FamilyMemberWithUser } from '@/prisma/types';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendInviteEmail(member: FamilyMemberWithUser, family: Family) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Invite <${process.env.FROM_EMAIL_ADDRESS}>`,
      to: [member.email],
      subject: 'Join the family',
      react: InviteEmailTemplate(member, family),
    });
    if (error) {
      console.error('sendInviteEmail:', error);
      return `Couldn't send email.`;
    }
    return data;
  } catch (error) {
    console.error('sendInviteEmail:', error);
    return `Something went wrong sending email.`;
  }
}

export async function resendInviteEmail(member: FamilyMemberWithUser) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
    };
  }

  try {

    const family = await prisma.family.findUnique({
      where: {
        id: member.familyId,
      }
    });
    if (!family) {
      return {
        success: false,
        message: `Something weird happened... maybe refresh and make sure this member is still in the family?`,
      };
    }

    let updatedMember: FamilyMemberWithUser;

    if (!member.inviteToken) {
      const token = randomBytes(20).toString('hex');
      const tokenExpiry = Date.now() + 60 * 60 * 24 * 30 * 1000; // 30 days
      updatedMember = await prisma.familyMember.update({
        where: {
          id: member.id,
        },
        data: {
          inviteToken: token,
          inviteTokenExpiry: new Date(tokenExpiry),
        },
        include: {
          user: true,
        }
      });
      
    }
    
    const result = await sendInviteEmail(member, family);
    if (result) {
      revalidatePath('/manage-family');
      return {
        success: true,
        message: '',
      };
    } else {
      console.error(result);
      return {
        success: false,
        message: `Couldn't send email.`,
      };
    }

  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
    };
  }

}

export async function createFamilyMember(data: FamilyMemberSchemaType & { family: Family }) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
    };
  }

  const validatedData = FamilyMemberSchema.parse(data);

  const familyWithManagers = await prisma.family.findUnique({
    where: {
      id: data.family.id,
    },
    include: {
      managers: true,
    }
  });
  if (!familyWithManagers?.managers.find((manager) => manager.userId === session.user?.id)) {
    return {
      success: false,
      message: 'You must be a family manager to do this.',
    };
  }

  try {
    const token = randomBytes(20).toString('hex');
    const tokenExpiry = Date.now() + 60 * 60 * 24 * 30 * 1000; // 30 days
    const member = await prisma.familyMember.create({
      data: {
        ...validatedData,
        family: {
          connect: {
            id: data.family.id,
          },
        },
        inviteToken: token,
        inviteTokenExpiry: new Date(tokenExpiry),
      },
      include: { 
        user: true,
      },
    });
    if (member) {
      await sendInviteEmail(member, data.family);
      revalidatePath('/manage-family');
      return {
        success: true,
        member,
        message: '',
      };
    } else {
      return {
        success: false,
        member,
        message: 'Something went wrong.',
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
    };
  }
}

export async function createFamily(data: FamilySchemaType) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      family: null,
    };
  }

  const validatedData = FamilySchema.parse(data);

  try {
    const family = await prisma.family.create({
      data: {
        ...validatedData,
        manager: {
          connect: {
            id: session.user.id,
          },
        },
        members: {
          create: [
            {
              name: session.user.name || '',
              email: session.user.email || '',
              user: {
                connect: {
                  id: session.user.id,
                },
              },
              joined: true,
            },
          ],
        },
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/manage-family');

    if (family) {
      // Create family channel in convex
      const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
      await client.mutation(api.channels.createChannel, {
        name: family.name,
        users: [session.user.id!],
        type: 'family',
        messages: [],
        family: family.id,
      });
      return {
        success: true,
        family,
        message: '',
      };
    } else {
      return {
        success: false,
        family,
        message: 'Something went wrong.',
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: `Couldn't create family.`,
    };
  }
}

export async function deleteFamily(family: Family) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      family: null,
    };
  }
  const familyWithManagers = await prisma.family.findUnique({
    where: {
      id: family.id,
    },
    include: {
      managers: true,
    }
  });
  if (!familyWithManagers?.managers.find((manager) => manager.userId === session.user?.id)) {
    return {
      success: false,
      message: 'You must be a family manager to do this.',
    };
  }
  try {
    await prisma.familyMember.deleteMany({
      where: {
        familyId: family.id,
      },
    });
    const oldFamily = await prisma.family.delete({
      where: {
        id: family.id,
        manager: {
          id: session.user.id,
        },
      },
    });
    revalidatePath('/manage-family');
    if (oldFamily) {
      const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
      await client.mutation(api.channels.deleteChannel, { family: oldFamily.id });

      return {
        success: true,
        oldFamily,
      };
    } else {
      return {
        succuss: false,
        message: `Couldn't find family to delete.'`,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong',
    };
  }
}

export async function deleteMember(member: FamilyMember, deleteAssignments: boolean = false) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      events: null,
    };
  }
  const family = await prisma.family.findUnique({
    where: {
      id: member.familyId,
    },
    include: {
      managers: true,
    }
  });

  if (!family) {
    return {
      success: false,
      message: `It seems like this person isn't in this family anyway?`,
      events: null,
    };
  }

  if (!family.managers.find((manager) => manager.userId === session.user?.id)) {
    return {
      success: false,
      message: 'You must be a family manager to do this.',
      events: null,
    };
  }

  if (family.managers.length === 1) {
    return {
      success: false,
      message: 'Families must have at least one manager.',
      members: null,
    };
  }
  
  try {
    
    // check if the member is a part of any events with secret santa assignments.
    const events = await prisma.event.findMany({
      where: {
        assignments: {
          some: {
            OR: [
              {
                giverId: member.id,
              },
              {
                receiverId: member.id,
              },
            ]
          },
        }
      },
    });

    if (!!events.length) {
    
      if (deleteAssignments) {
        // delete all the assignments for the events
        await prisma.assignment.deleteMany({
          where: {
            eventId: {
              in: events.map((event) => event.id),
            },
          }
        });
      } else {

        return {
          success: false,
          events,
          message: `This member is part of a secret santa event. If you continue, we'll have to undo all the assignments.`,
        }
      }
    }

    const formerMember = await prisma.familyMember.delete({
      where: {
        id: member.id,
      },
    });
    if (formerMember) {
      revalidatePath('/manage-family');
      return {
        success: true,
        message: '',
        events: null,
      };
    } else {
      return {
        success: false,
        message: `Couldn't find member to delete`,
        events: null,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
      events: null,
    };
  }
}

export async function promoteMember(member: FamilyMember) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      members: null,
    };
  }
  const family = await prisma.family.findUnique({
    where: {
      id: member.familyId,
    },
    include: {
      managers: true  
    }
  });
  if (!family) {
    return {
      success: false,
      message: `Couldn't find family or member.`,
      members: null,
    };
  }
  if (!family.managers.find((manager) => manager.userId === session.user?.id)) {
    return {
      success: false,
      message: 'You must be a family manager to do this.',
      members: null,
    };
  }
  try {
    const updatedFamily = await prisma.family.update({
      where: {
        id: family.id,
      },
      data: {
        managers: {
          connect: {
            id: member.id,
          },
        }
      },
      include: {
        members: {
          include: {
            user: true,
          }
        },
      }
    });
    if (updatedFamily) {
      revalidatePath('/manage-family');
      return {
        success: true,
        message: '', 
        members: updatedFamily.members
      };
    } else {
      return {
        success: false,
        message: `Couldn't promote member.`,
        members: null,
      };
    }
  } catch(err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
      members: null,
    };
  }
}

export async function demoteMember(member: FamilyMember) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      members: null,
    };
  }
  const family = await prisma.family.findUnique({
    where: {
      id: member.familyId,
    },
    include: {
      managers: true
    }
  });
  if (!family) {
    return {
      success: false,
      message: `Couldn't find family or member.`,
      members: null,
    };
  }
  if (!family.managers.find((manager) => manager.userId === session.user?.id)) {
    return {
      success: false,
      message: 'You must be a family manager to do this.',
      members: null,
    };
  }
  if (family.managers.length === 1) {
    return {
      success: false,
      message: 'Families must have at least one manager.',
      members: null,
    };
  }
  try {
    const updatedFamily = await prisma.family.update({
      where: {
        id: family.id,
      },
      data: {
        managers: {
          disconnect: {
            id: member.id,
          },
        }
      },
      include: {
        members: {
          include: {
            user: true,
          }
        },
      }
    });
    if (updatedFamily) {
      revalidatePath('/manage-family');
      return {
        success: true,
        message: '', 
        members: updatedFamily.members
      };
    } else {
      return {
        success: false,
        message: `Couldn't promote member.`,
        members: null,
      };
    }
  } catch(err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.',
      members: null,
    };
  }
}