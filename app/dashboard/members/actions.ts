'use server';

import { getAllEvents as getAllEventsQuery } from '@/lib/queries/events';
import { getFamilies as getFamiliesQuery } from '@/lib/queries/families';

export async function getFamilies() {
  return await getFamiliesQuery();
}

export async function getAllEvents() {
  return await getAllEventsQuery();
}
