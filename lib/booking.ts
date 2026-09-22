// Booking time windows + online booking capacity.
//
// The working day runs 8 AM – 5 PM Central and is split into four three-hour
// windows that overlap by an hour, so a customer who misses one still has a
// later option on the same day.
//
// A window is offered only while it is still ahead: on the current day it
// closes MIN_LEAD_MINUTES before it starts, so nobody can book a window that
// is already running. It also closes once MAX_BOOKINGS_PER_SLOT leads have
// been submitted for it (phone bookings are not counted).

export const BUSINESS_TZ = 'America/Chicago';

export interface TimeSlotDef {
  label: string;
  /** minutes from midnight in BUSINESS_TZ */
  startMinutes: number;
  endMinutes: number;
}

export const TIME_SLOT_DEFS: readonly TimeSlotDef[] = [
  { label: '8 AM – 11 AM', startMinutes: 8 * 60, endMinutes: 11 * 60 },
  { label: '10 AM – 1 PM', startMinutes: 10 * 60, endMinutes: 13 * 60 },
  { label: '12 PM – 3 PM', startMinutes: 12 * 60, endMinutes: 15 * 60 },
  { label: '2 PM – 5 PM', startMinutes: 14 * 60, endMinutes: 17 * 60 },
] as const;

export const TIME_SLOTS: readonly string[] = TIME_SLOT_DEFS.map((slot) => slot.label);

export type TimeSlot = string;

export const MAX_BOOKINGS_PER_SLOT = 2;

/** How long before a window starts online booking for it closes. */
export const MIN_LEAD_MINUTES = 60;

export type SlotStatus = 'open' | 'full' | 'closed';

export interface BusinessNow {
  /** YYYY-MM-DD in BUSINESS_TZ */
  date: string;
  /** minutes from midnight in BUSINESS_TZ */
  minutes: number;
}

/**
 * Current date and time in the shop's timezone. The server runs in UTC and a
 * customer's browser can be in any timezone, so both sides ask for Central
 * explicitly and get the same answer.
 */
export function businessNow(now: Date = new Date()): BusinessNow {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: BUSINESS_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? '00';
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  };
}

export const isValidDateISO = (dateISO: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(dateISO);

/** Texas books Monday–Friday only. Built in UTC so the weekday never shifts. */
export const isWeekendISO = (dateISO: string): boolean => {
  const [y, m, d] = dateISO.split('-').map(Number);
  if (!y || !m || !d) return false;
  const day = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return day === 0 || day === 6;
};

export const addDaysISO = (dateISO: string, days: number): string => {
  const [y, m, d] = dateISO.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
};

/**
 * Can this window still be booked on this date? Capacity is checked separately
 * against the counter DB — this is the calendar side only.
 */
export function isSlotOpen(
  dateISO: string,
  slotLabel: string,
  now: BusinessNow = businessNow()
): boolean {
  const slot = TIME_SLOT_DEFS.find((def) => def.label === slotLabel);
  if (!slot) return false;
  if (!isValidDateISO(dateISO) || isWeekendISO(dateISO)) return false;
  if (dateISO < now.date) return false;
  if (dateISO > now.date) return true;
  return slot.startMinutes - MIN_LEAD_MINUTES >= now.minutes;
}

export const hasOpenSlots = (dateISO: string, now: BusinessNow = businessNow()): boolean =>
  TIME_SLOT_DEFS.some((slot) => isSlotOpen(dateISO, slot.label, now));

/**
 * Earliest date still worth offering: today while a window is open, otherwise
 * the next weekday. Used as the `min` of the date picker.
 */
export function firstBookableDate(now: BusinessNow = businessNow()): string {
  let date = now.date;
  for (let i = 0; i < 14; i += 1) {
    if (hasOpenSlots(date, now)) return date;
    date = addDaysISO(date, 1);
  }
  return date;
}
