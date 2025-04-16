'use server';

import { getMembers as getMembersQuery } from '@/lib/queries/members';

export async function getMembers(memberIds: string[]) {
  return await getMembersQuery(memberIds);
}
