import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => capitalize(word))
    .join(' ');
}

export const PHONE_NUMBER = '+18177996313';
export const PHONE_DISPLAY = '(817) 799-6313';
export const BUSINESS_EMAIL = 'help@h-prime-co.com';
export const BUSINESS_NAME = 'H-Prime Appliance Repair Services';
export const BUSINESS_ADDRESS = 'Fort Worth, TX';
// Shown in the header instead of the address: pages cover two markets, and a
// Houston visitor should not read the pin as "Fort Worth only".
export const SERVICE_AREA_LABEL = 'Dallas-Fort Worth & Houston';
// Live GBP values (checked 2026-09-20, place_id ChIJ6dWdU5D8_WgRf-crfXWkxY8).
// Texas has no profile of its own: these are the company's Denver GBP figures.
// Single source of truth: lib/seo/schema.ts imports these, never redeclares them.
export const GOOGLE_RATING = 4.9;
export const GOOGLE_REVIEW_COUNT = '218';
export const GOOGLE_BUSINESS_PROFILE_URL = 'https://search.google.com/local/reviews?placeid=ChIJ6dWdU5D8_WgRf-crfXWkxY8';


// Professional icons (Lucide React style)
export const icons = {
  phone: '📞',
  calendar: '📅',
  checkCircle: '✓',
  star: '⭐',
  clock: '⏱️',
  shield: '🛡️',
  award: '🏆',
  wrench: '🔧',
};

