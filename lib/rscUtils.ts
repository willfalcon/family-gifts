import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

const ACTIVE_FAMILY_COOKIE = 'activeFamilyId';

export function getActiveFamilyId() {
  // For server components
  if (typeof window === 'undefined') {
    const cookieStore = cookies();
    return cookieStore.get(ACTIVE_FAMILY_COOKIE)?.value;
  }

  //for client components
  return getCookie(ACTIVE_FAMILY_COOKIE) as string | undefined;
}

