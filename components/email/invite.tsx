import { FamilyMember } from '@prisma/client';

export default function InviteEmailTemplate(member: FamilyMember) {
  return (
    <div>
      <h1>Join the family</h1>
      <p>Someone invited you to join the family on Family Gifts.</p>
      <a href={`https://${process.env.FRONTEND_URL}/join?token=${member.inviteToken}`}>Join Now</a>
    </div>
  );
}
