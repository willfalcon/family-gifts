import { clsx, type ClassValue } from "clsx"
import { setCookie } from "cookies-next";
import { twMerge } from "tailwind-merge"
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDefaults<Schema extends z.AnyZodObject>(schema: Schema) {
  return Object.fromEntries(
    Object.entries(schema.shape).map(([key, value]) => {
      if (value instanceof z.ZodDefault) return [key, value._def.defaultValue()];
      return [key, undefined];
    })
  );
}

export async function getASIN(url: string) {
  const asinRegex = /\/([A-Z0-9]{10})(?=[/?]|$)/;
  const match = url.match(asinRegex);

  if (match && match[1]) {
    return match[1];
  } else {
    const response = await fetch(url, {method: 'GET', redirect: 'follow'});
    const finalUrl = response.url;
    console.log('url: ', finalUrl);
    const matchAgain = finalUrl.match(asinRegex);
    if (matchAgain && matchAgain[1]) {
      return matchAgain[1];
    } 
  }
}

const ACTIVE_FAMILY_COOKIE = 'activeFamilyId';

export function setActiveFamilyId(familyId: string) {
  setCookie(ACTIVE_FAMILY_COOKIE, familyId, { maxAge: 30 * 24 * 60 * 60 }); // 30 days
}