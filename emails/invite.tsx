import { Family, Invite } from '@prisma/client';
import { Body, Button, Container, Head, Heading, Html, Link, Preview, Section, Tailwind, Text } from '@react-email/components';

export default function InviteEmailTemplate(member: Invite, family: Family) {
  const previewText = `Someone invited you to join the family on Family Gifts.`;
  const inviteLink = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/join?token=${member.token}`;
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body>
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                Join <strong>{family.name}</strong> on <strong>Family Gifts</strong>
              </Heading>
              <Text className="text-black text-[14px] leading-[24px]">Hello,</Text>
              <Text className="text-black text-[14px] leading-[24px]">
                You&apos;ve been invited to join <strong>{family.name}</strong> on <strong>Family Gifts</strong>.
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
  token: 'sampleInviteToken',
  family: {
    name: 'Sample Family',
  },
};
