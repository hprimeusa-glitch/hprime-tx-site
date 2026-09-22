import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import {
  MAX_BOOKINGS_PER_SLOT,
  SlotStatus,
  TIME_SLOT_DEFS,
  businessNow,
  firstBookableDate,
  isSlotOpen,
  isValidDateISO,
} from '@/lib/booking';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const now = businessNow();
  const minDate = firstBookableDate(now);

  // No date yet: the form only needs the earliest day it may offer.
  const requested = request.nextUrl.searchParams.get('date');
  const date = requested ?? minDate;
  if (!isValidDateISO(date)) {
    return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
  }

  // Calendar first: a window that has already started is closed whatever the
  // counter says.
  const status: Record<string, SlotStatus> = {};
  for (const slot of TIME_SLOT_DEFS) {
    status[slot.label] = isSlotOpen(date, slot.label, now) ? 'open' : 'closed';
  }

  try {
    const pool = getPool();
    if (pool) {
      const { rows } = await pool.query(
        'SELECT time_slot, cnt FROM reporting.hprime_tx_slots WHERE booking_date = $1',
        [date]
      );
      for (const row of rows) {
        if (status[row.time_slot] === 'open' && row.cnt >= MAX_BOOKINGS_PER_SLOT) {
          status[row.time_slot] = 'full';
        }
      }
    }
  } catch (error) {
    // Fail open: if the counter DB is unreachable, keep open slots bookable
    console.error('[SLOTS] availability check failed, failing open:', error);
  }

  return NextResponse.json({ date, today: now.date, minDate, status });
}
