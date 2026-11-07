import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import {
  MAX_BOOKINGS_PER_SLOT,
  SlotStatus,
  TIME_SLOT_DEFS,
  businessNow,
  closedRangeFor,
  firstBookableDate,
  isSlotOpen,
  isValidDateISO,
  slotLabelFromKey,
  upcomingClosures,
} from '@/lib/booking';
import { parseFormType } from '@/lib/formType';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const now = businessNow();
  // ?form=gym reads the gym counter; anything else reads the appliance counter.
  const formType = parseFormType(request.nextUrl.searchParams.get('form'));
  const minDate = firstBookableDate(now, formType);

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
    status[slot.label] = isSlotOpen(date, slot.label, now, formType) ? 'open' : 'closed';
  }

  try {
    const pool = getPool();
    if (pool) {
      const { rows } = await pool.query(
        'SELECT time_slot, cnt FROM reporting.hprime_tx_slots WHERE booking_date = $1',
        [date]
      );
      for (const row of rows) {
        const label = slotLabelFromKey(row.time_slot, formType);
        if (label && status[label] === 'open' && row.cnt >= MAX_BOOKINGS_PER_SLOT) {
          status[label] = 'full';
        }
      }
    }
  } catch (error) {
    // Fail open: if the counter DB is unreachable, keep open slots bookable
    console.error('[SLOTS] availability check failed, failing open:', error);
  }

  // dayClosed: label of the closure covering this date (time off, holiday), or null.
  // closures: labels of closures still ahead, for the hint under the date field.
  return NextResponse.json({
    date,
    today: now.date,
    minDate,
    status,
    dayClosed: closedRangeFor(date, formType)?.label ?? null,
    closures: upcomingClosures(now.date, formType).map((range) => range.label),
  });
}
