import { getActiveMember } from '@/lib/queries/family-members';
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await getActiveMember();
  return NextResponse.json(res);
}
