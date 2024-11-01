'use server';

import { auth } from "@/auth";
import { FamilyMemberSchema, FamilyMemberSchemaType } from "./familyMemberSchema";
import { prisma } from "@/prisma";
import { FamilySchema, FamilySchemaType } from "./familySchema";
import { revalidatePath } from "next/cache";
import { Family, FamilyMember } from "@prisma/client";
import InviteEmailTemplate from "@/components/email/invite";
import { Resend } from "resend";
import { randomBytes } from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendInviteEmail(member: FamilyMember) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Invite <invites@resend.dev>',
      to: [member.email],
      subject: 'Join the family',
      react: InviteEmailTemplate(member),
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
};

export async function createFamilyMember(data: FamilyMemberSchemaType & {family: Family}) {

  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
    };
  }


  const validatedData = FamilyMemberSchema.parse(data);

  if (data.family.managerId !== session.user.id) {
    return {
      success: false,
      message: 'You must be a family manager to do this.'
    }
  }

  try {
    const token = randomBytes(20).toString('hex');
    // const tokenExpiry = Date.now() + 60 * 60 * 24 * 30 * 1000;
    const member = await prisma.familyMember.create({
      data: {
        ...validatedData,
        family: {
          connect: {
            id: data.family.id
          }
        },
        inviteToken: token,
      }
    });
    if (member) {
      const email = await sendInviteEmail(member);
      console.log(email);
      return {
        success: true,
        member,
        message: ''
      }
    } else {
      return {
        success: false,
        member,
        message: 'Something went wrong.'
      }
    }
  } catch(err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.'
    }
  }
}

export async function createFamily(data: FamilySchemaType) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      family: null
    };
  }

  const validatedData = FamilySchema.parse(data);

  try {
    
    const family = await prisma.family.create({
      data: {
        ...validatedData,
        manager: {
          connect: {
            id: session.user.id
          }
        },
        members: {
          create: [{
            name: session.user.name || '',
            email: session.user.email || '',
            user: {
              connect: {
                id: session.user.id
              }
            },
            joined: true
          }]
        }
      }
    });

    revalidatePath('/manage-family');

    if (family) {
      return {
        success: true,
        family,
        message: ''
      }
    } else {
      return {
        success: false,
        family,
        message: 'Something went wrong.'
      }
    }
  } catch(err) {
    console.error(err);
    return {
      success: false,
      message: `Couldn't create family.`
    }
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
 if (family.managerId !== session.user.id) {
   return {
     success: false,
     message: 'You must be a family manager to do this.',
   };
 }
 try {
  await prisma.familyMember.deleteMany({
    where: {
      familyId: family.id
    }
  });
  const oldFamily = await prisma.family.delete({
    where: {
      id: family.id,
      manager: {
        id: session.user.id
      }
    }
  });
  revalidatePath('/manage-family');
  if (oldFamily) {
    return {
      success: true,
      oldFamily
    }
  } else {
    return {
      succuss: false,
      message: `Couldn't find family to delete.'`
    }
  }
 } catch(err) {
  console.error(err);
  return {
    success: false,
    message: 'Something went wrong'
  }
 }
}

export async function deleteMember(member: FamilyMember) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: 'You must be logged in to do this.',
      family: null,
    };
  }
  const family = await prisma.family.findUnique({
    where: {
      id: member.familyId
    }
  });

  if (!family) {
    return {
      success: false,
      message: `It seems like this person isn't in this family anyway?`
    }
  }

  if (family.managerId !== session.user.id) {
    return {
      success: false,
      message: 'You must be a family manager to do this.',
    };
  }

  try {
    const formerMember = await prisma.familyMember.delete({
      where: {
        id: member.id
      }
    });
    if (formerMember) {
      revalidatePath('/manage-family');
      return {
        success: true,
        formerMember
      }
    } else {
      return {
        success: false,
        message: `Couldn't find member to delete`
      }
    }
  } catch(err) {
    console.error(err);
    return {
      success: false,
      message: 'Something went wrong.'
    }
  }
}