import { getActiveMemberUser } from '@/lib/queries/family-members';
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await getActiveMemberUser();
  return NextResponse.json(res);
}
