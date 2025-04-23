import { Body, Button, Container, Head, Heading, Html, Link, Preview, Section, Tailwind, Text } from '@react-email/components';

export default function ResetPasswordEmailTemplate(token: string) {
  const previewText = `Reset your password on Family Gifts.`;
  const resetLink = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/reset-password?token=${token}`;
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body>
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">Reset your password on Family Gifts</Heading>
            </Section>
            <Button className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3" href={resetLink}>
              Reset Password
            </Button>
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{' '}
              <Link href={resetLink} className="text-blue-600 no-underline">
                {resetLink}
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

ResetPasswordEmailTemplate.PreviewProps = {
  token: 'sampleInviteToken',
  email: 'sample@email.com',
};
