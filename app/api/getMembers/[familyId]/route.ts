import { getMembers } from '@/prisma/queries';
import { NextResponse } from 'next/server';

export async function GET(request: Request, {params}: {params: Promise<{familyId: string}>}) {
  const familyId = (await params).familyId;
  const res = await getMembers(familyId);
  return NextResponse.json(res);
}