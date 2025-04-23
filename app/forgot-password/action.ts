'use server';

import ResetPasswordEmailTemplate from '@/emails/passwordReset';
import { prisma } from '@/prisma';
import { randomBytes } from 'crypto';
import { Resend } from 'resend';

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return;
  }

  const token = randomBytes(20).toString('hex');

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      resetPasswordToken: token,
      resetPasswordTokenExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });

  await sendResetEmail(token, user.email!);
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetEmail(token: string, email: string) {
  const { data, error } = await resend.emails.send({
    from: `Invite <${process.env.FROM_EMAIL_ADDRESS}>`,
    to: [email!],
    subject: 'Reset your password',
    react: ResetPasswordEmailTemplate(token),
  });
  if (error) {
    console.error('sendResetEmail:', error);
    throw new Error(`Couldn't send email.`);
  }
  return data;
}
