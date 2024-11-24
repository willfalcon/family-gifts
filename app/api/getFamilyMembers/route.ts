import { getFamilyMembers } from '@/lib/queries/family-members';
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await getFamilyMembers();
  return NextResponse.json(res);
}
