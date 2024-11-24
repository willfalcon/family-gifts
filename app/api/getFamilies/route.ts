import { getFamilies } from '@/lib/queries/families';
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await getFamilies();
  return NextResponse.json(res);
}
