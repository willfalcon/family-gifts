import { getActiveMemberAll } from '@/lib/queries/family-members';
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await getActiveMemberAll();
  return NextResponse.json(res);
}
