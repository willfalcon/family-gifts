import { prisma } from '@/prisma';
import { clsx, type ClassValue } from 'clsx';
import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';
import { twMerge } from 'tailwind-merge';
import { getFamilies } from './queries/families';

const ACTIVE_FAMILY_COOKIE = 'activeFamilyId';

export async function getActiveFamilyId() {
  //First just get the familyId cookie if it's set:

  // For server components
  let id;
  if (typeof window === 'undefined') {
    const cookieStore = await cookies();
    id = cookieStore.get(ACTIVE_FAMILY_COOKIE)?.value;
  } else {
    //for client components
    id = getCookie(ACTIVE_FAMILY_COOKIE) as string | undefined;
  }

  // IF the familyId cookie was set, check for a real family in the database, and return the familyIf its real.
  if (id) {
    const activeFamilyId = await prisma.family.findUnique({ where: { id: id } });
    if (activeFamilyId) {
      return activeFamilyId.id;
    }
  }

  // In all other cases, just return the first family they're in and run with that until they set a different one.

  const families = await getFamilies();
  if (families.length > 0) {
    return families[0].id;
  }

  // at this point they're not in any families, they should be presented with the create family form

  return undefined;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
