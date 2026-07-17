import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { TIME_SLOTS, MAX_BOOKINGS_PER_SLOT } from '@/lib/booking';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date') || '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
  }

  const availability: Record<string, boolean> = {};
  for (const slot of TIME_SLOTS) availability[slot] = true;

  try {
    const pool = getPool();
    if (pool) {
      const { rows } = await pool.query(
        'SELECT time_slot, cnt FROM reporting.hprime_tx_slots WHERE booking_date = $1',
        [date]
      );
      for (const row of rows) {
        if (row.time_slot in availability) {
          availability[row.time_slot] = row.cnt < MAX_BOOKINGS_PER_SLOT;
        }
      }
    }
  } catch (error) {
    // Fail open: if the counter DB is unreachable, keep all slots bookable
    console.error('[SLOTS] availability check failed, failing open:', error);
  }

  return NextResponse.json({ date, availability });
}
