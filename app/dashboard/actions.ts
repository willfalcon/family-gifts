'use server';

import { getEvents, getEventsCount } from '@/lib/queries/events';
import { getSomeMembers } from '@/lib/queries/family-members';
import { revalidatePath } from 'next/cache';

export async function reloadDashboard() {
  revalidatePath('/dashboard');
}

export async function dashboardGetMembers(getRest = false) {
  try {
    if (getRest) {
      const { success, members, message } = await getSomeMembers(-1, 2);
      if (success) {
        return members;
      } else {
        throw new Error(message);
      }
    } else {
      const { success, members, message } = await getSomeMembers(3);
      if (success) {
        return members;
      } else {
        throw new Error(message);
      }
    }
  } catch (err) {
    throw new Error('Something went wrong.');
  }
}

export async function dashboardGetEvents(getRest = false) {
  try {
    const { count } = await getEventsCount();
    if (getRest) {
      const { success, events, message } = await getEvents(-1, 2);
      if (success) {
        return {
          events,
          total: count,
        };
      } else {
        throw new Error(message);
      }
    } else {
      const { success, events, message } = await getEvents(3);
      if (success) {
        return { events, total: count };
      } else {
        throw new Error(message);
      }
    }
  } catch (err) {
    throw new Error('Something went wrong.');
  }
}
