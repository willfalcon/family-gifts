import { clsx, type ClassValue } from 'clsx';
import { setCookie } from 'cookies-next';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import wordsToNumbers from 'words-to-numbers';
import { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDefaults<Schema extends z.AnyZodObject>(schema: Schema) {
  return Object.fromEntries(
    Object.entries(schema.shape).map(([key, value]) => {
      if (value instanceof z.ZodDefault) return [key, value._def.defaultValue()];
      return [key, undefined];
    }),
  );
}

export async function getASIN(url: string) {
  const asinRegex = /\/([A-Z0-9]{10})(?=[/?]|$)/;
  const match = url.match(asinRegex);

  if (match && match[1]) {
    return match[1];
  } else {
    try {
      const response = await fetch(url, { method: 'GET', redirect: 'follow' });
      const finalUrl = response.url;

      const matchAgain = finalUrl.match(asinRegex);
      if (matchAgain && matchAgain[1]) {
        return matchAgain[1];
      }
    } catch {
      return null;
    }
  }
}

const ACTIVE_FAMILY_COOKIE = 'activeFamilyId';

export function setActiveFamilyId(familyId: string) {
  setCookie(ACTIVE_FAMILY_COOKIE, familyId, { maxAge: 30 * 24 * 60 * 60 }); // 30 days
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatDate(date: Date) {
  return format(date, 'MMMM d, yyyy');
}

export function formatTime(time: Date) {
  return format(time, 'h:mm aaa');
}

export function formatCurrency(amount: string | number | null) {
  if (typeof amount === 'number') {
    const tryFormat =
      typeof amount === 'number'
        ? new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
          }).format(amount)
        : NaN;

    if (tryFormat !== 'NaN') {
      return tryFormat;
    }
  }

  if (typeof amount === 'string') {
    const number = wordsToNumbers(amount);
    const numberInt = typeof number === 'string' ? parseFloat(number) : number;
    if (numberInt === null) {
      return '';
    }
    const wordsConvert = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: numberInt % 1 === 0 ? 0 : 2,
    }).format(numberInt);

    if (wordsConvert !== 'NaN') {
      return wordsConvert;
    }
  }

  return '';
}

export function userInitials(name: string | null) {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('');
}
