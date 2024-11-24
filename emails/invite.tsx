import { Body, Button, Container, Head, Heading, Html, Link, Preview, Section, Text, Tailwind } from '@react-email/components';
import { FamilyMember } from '@prisma/client';
import { FamilyMemberWithFamily } from '@/prisma/types';

export default function InviteEmailTemplate(member: FamilyMemberWithFamily) {
  const previewText = `Someone invited you to join the family on Family Gifts.`;
  const inviteLink = `https://${process.env.FRONTEND_URL}/join?token=${member.inviteToken}`;
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body>
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                Join <strong>{member.family.name}</strong> on <strong>Family Gifts</strong>
              </Heading>
              <Text className="text-black text-[14px] leading-[24px]">Hello {member.name},</Text>
              <Text className="text-black text-[14px] leading-[24px]">
                You've been invited to join <strong>{member.family.name}</strong> on <strong>Family Gifts</strong>.
              </Text>
            </Section>
            <Button className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3" href={inviteLink}>
              Join Now
            </Button>
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{' '}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

InviteEmailTemplate.PreviewProps = {
  inviteToken: 'sampleInviteToken',
  family: {
    name: 'Sample Family',
  },
  name: 'John Doe',
};
