import {Resend} from 'resend';
import InviteEmailTemplate from '@/components/email/invite';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const {data, error} = await resend.emails.send({
      from: 'Invite <invites@familygifts.com>',
      to: ['willkhawks@gmail.com'],
      subject: 'Join the family',
      react: InviteEmailTemplate()
    });
    if (error) {
      return Response.json({error}, {status: 500});
    }
    return Response.json(data);
  } catch (error) {
    return Response.json({error}, {status: 500});
  }
}