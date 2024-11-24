import { Body, Button, Container, Head, Heading, Html, Link, Preview, Section, Text, Tailwind, Row, Column } from '@react-email/components';
import { EventWithFamily } from '@/prisma/types';
import { FamilyMember } from '@prisma/client';
import { format } from 'date-fns';
// import { JSONContent } from '@tiptap/react';
// import Viewer from '@/components/ui/rich-text/viewer';

export default function secretSantaNotification({ recipient, event }: { recipient: FamilyMember; event: EventWithFamily }) {
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
                  <Text>Family: {event.family.name}</Text>
                  {event.date && <Text>Date: {format(event.date, 'MMMM dd, yyyy')}</Text>}
                  {event.location && <Text>Location: {event.location}</Text>}
                  {/* {event.info && <Viewer content={event.info as JSONContent} />} */}
                </Column>
              </Row>
              <Row>
                <Heading as="h2">Your assignment: {recipient.name}</Heading>
                <Button href={`${process.env.frontendUrl}/dashboard/family/${recipient.id}`}>View Profile</Button>
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
