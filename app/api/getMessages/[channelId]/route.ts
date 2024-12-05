import { getNewMessages } from '@/lib/queries/chat';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ channelId: string }> }) {
  const channelId = (await params).channelId;
  const res = await getNewMessages(channelId);
  return NextResponse.json(res);
}
