import { Event, User } from '@prisma/client';
import { Body, Button, Column, Container, Head, Heading, Html, Preview, Row, Section, Tailwind, Text } from '@react-email/components';

import { formatDate } from '@/lib/utils';

export default function secretSantaNotification({ recipient, event }: { recipient: User; event: Event }) {
  return (
    <Html>
      <Head />
      <Preview>You've been assigned someone for Secret Santa</Preview>
      <Tailwind>
        <Body>
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                Your Secret Santa Assignment for {event.name}
              </Heading>
              <Row>
                <Column>
                  <Heading as="h2">Event details:</Heading>
                  {event.date && <Text>Date: {formatDate(event.date)}</Text>}
                  {event.location && <Text>Location: {event.location}</Text>}
                </Column>
              </Row>
              <Row>
                <Heading as="h2">Your assignment: {recipient.name}</Heading>
                <Button href={`${process.env.frontendUrl}/dashboard/members/${recipient.id}`}>View Lists</Button>
                <Button href={`${process.env.frontendUrl}/dashboard/events/${event.id}`}>View Event</Button>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

secretSantaNotification.PreviewProps = {
  event: {
    name: 'Event Name',
    date: new Date(),
    location: 'Location',
    info: {},
    family: {
      name: 'Family Name',
    },
  },
  recipient: {
    name: 'Recipient Name',
    id: 'recipientId',
  },
};
