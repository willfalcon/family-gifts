import { auth } from '@/auth';
import { getChannels } from '@/lib/queries/chat';
import { getActiveMember } from '@/lib/queries/family-members';
import { ChannelWithType } from '@/prisma/types';
import { FamilyMember } from '@prisma/client';
// import Ably from 'ably';
import { SignJWT } from 'jose';
// ensure Vercel doesn't cache the result of this route,
// as otherwise the token request data will eventually become outdated
// and we won't be able to authenticate on the client side
export const revalidate = 0;

// async function OldGET() {
//   const client = new Ably.Rest(process.env.ABLY_API_KEY!);
//   const tokenRequestData = await client.auth.createTokenRequest({
//     clientId: process.env.ABLY_CLIENT_ID,
//   });
//   return Response.json(tokenRequestData);
// }

type Capability = {
  [key: string]: string[];
};
async function createToken(clientId: string, apiKey: string, capability: Capability) {
  const [appId, signingKey] = apiKey.split(':', 2);
  const enc = new TextEncoder();
  const token = new SignJWT({
    'x-ably-capability': JSON.stringify(capability),
    'x-ably-clientId': clientId,
    // 'ably.channel.*': JSON.stringify(claim),
  })
    .setProtectedHeader({ kid: appId, alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(enc.encode(signingKey));
  return token;
}

const generateCapability = (channels: ChannelWithType[], me: FamilyMember) => {
  // TODO: Add more specific capabilities depending on type of channel and family manager or not
  console.log(channels, me);
  const caps = Object.fromEntries(
    channels.map((channel) => {
      switch (channel.type) {
        case 'family':
          if (me.familyId === channel.familyId) {
            return [`chat:${channel.id}`, ['subscribe', 'publish', 'presence', 'history']];
          }
          break;
        case 'event':
          if (channel.event?.familyId === me.familyId) {
            return [`chat:${channel.id}`, ['subscribe', 'publish', 'presence', 'history']];
          }
          break;
        case 'individual':
          if (channel.groupMembers.some((member) => member.id === me.id)) {
            return [`chat:${channel.id}`, ['subscribe', 'publish', 'presence', 'history']];
          }
          break;
      }
      return [`chat:${channel.id}`, []];
    }),
  );

  return caps;
  // if (claim.isMod) {
  //   return { '*': ['*'] };
  // } else {
  //   return {
  //     'chat:general': ['subscribe', 'publish', 'presence', 'history'],
  //     'chat:random': ['subscribe', 'publish', 'presence', 'history'],
  //     'chat:announcements': ['subscribe', 'presence', 'history'],
  //   };
  // }
};

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }
  const me = await getActiveMember();

  const { channels, success, message } = await getChannels();
  if (!success || !channels || !me) {
    return new Response(message, { status: 500 });
  }

  const capabilities = generateCapability(channels, me);
  try {
    const token = await createToken(session.user.id!, process.env.ABLY_API_KEY!, capabilities);
    return Response.json(token);
  } catch (error: unknown) {
    console.error(error);

    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
