'use server';

import { getAllEvents as getAllEventsQuery } from '@/lib/queries/events';
import { getFamilies as getFamiliesQuery } from '@/lib/queries/families';
import { getListsByMember as getListsByMemberQuery } from '@/lib/queries/lists';

export async function getFamilies() {
  return await getFamiliesQuery();
}

export async function getAllEvents() {
  return await getAllEventsQuery();
}

export async function getListsByMember(memberId: string) {
  return await getListsByMemberQuery(memberId);
}
