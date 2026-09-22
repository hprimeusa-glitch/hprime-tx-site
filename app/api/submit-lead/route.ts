import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { TIME_SLOTS, MAX_BOOKINGS_PER_SLOT, isSlotOpen, isValidDateISO } from '@/lib/booking';

interface LeadData {
  name: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  email: string;
  street?: string;
  apartment?: string;
  city?: string;
  zipCode?: string;
  appliance?: string;
  preferredDate?: string;
  preferredTimeSlot?: string;
  attribution?: Record<string, string>;
  submission_page?: string;
}

const escapeHtml = (s: string): string =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

async function releaseSlot(bookingDate: string, bookingSlot: string) {
  try {
    await getPool()?.query(
      'UPDATE reporting.hprime_tx_slots SET cnt = GREATEST(cnt - 1, 0), updated_at = now() WHERE booking_date = $1 AND time_slot = $2',
      [bookingDate, bookingSlot]
    );
  } catch (error) {
    console.error('[SLOTS] release failed:', error);
  }
}

export async function POST(request: NextRequest) {
  let slotReserved = false;
  let bookingDate = '';
  let bookingSlot = '';

  try {
    const data: LeadData = await request.json();

    if (!data.name || !data.phone || !data.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('[TELEGRAM] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID env vars');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Slot capacity control: atomically reserve a place in the requested slot.
    // Fails open on any DB problem — a lead must never be lost to the counter.
    bookingDate = data.preferredDate || '';
    bookingSlot = data.preferredTimeSlot || '';
    const validBooking =
      isValidDateISO(bookingDate) && TIME_SLOTS.includes(bookingSlot);

    // A window that is already running (or a weekend) is refused here too —
    // the browser can sit on the form long enough for its own check to go stale.
    if (validBooking && !isSlotOpen(bookingDate, bookingSlot)) {
      return NextResponse.json({ error: 'slot_closed', reason: 'closed' }, { status: 409 });
    }

    if (validBooking) {
      try {
        const pool = getPool();
        if (pool) {
          const { rows } = await pool.query(
            `INSERT INTO reporting.hprime_tx_slots (booking_date, time_slot, cnt)
             VALUES ($1, $2, 1)
             ON CONFLICT (booking_date, time_slot)
             DO UPDATE SET cnt = reporting.hprime_tx_slots.cnt + 1, updated_at = now()
             WHERE reporting.hprime_tx_slots.cnt < $3
             RETURNING cnt`,
            [bookingDate, bookingSlot, MAX_BOOKINGS_PER_SLOT]
          );
          if (rows.length === 0) {
            return NextResponse.json({ error: 'slot_full', reason: 'full' }, { status: 409 });
          }
          slotReserved = true;
        }
      } catch (error) {
        console.error('[SLOTS] capacity check failed, failing open:', error);
      }
    }

    const sourceUrl = request.headers.get('referer') || 'unknown';
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/Chicago',
      dateStyle: 'short',
      timeStyle: 'short',
    });

    const phoneDigits = data.phone.replace(/\D/g, '');
    const phoneFormatted =
      phoneDigits.length === 10
        ? `(${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3, 6)}-${phoneDigits.slice(6)}`
        : data.phone;

    const addressParts: string[] = [];
    if (data.street) addressParts.push(data.street);
    if (data.apartment) addressParts.push(data.apartment);
    if (data.city) {
      addressParts.push(`${data.city}, TX ${data.zipCode || ''}`.trim());
    }
    const addressLine = addressParts.join(', ');

    const lines: string[] = [
      '🔔 <b>New Appliance Repair Lead (Texas)</b>',
      '',
      `👤 <b>Name:</b> ${escapeHtml(data.name)}`,
      `📞 <b>Phone:</b> <a href="tel:+1${phoneDigits}">${escapeHtml(phoneFormatted)}</a>`,
      `📧 <b>Email:</b> ${escapeHtml(data.email)}`,
    ];
    if (addressLine) {
      lines.push(`📍 <b>Address:</b> ${escapeHtml(addressLine)}`);
    }
    if (data.appliance) {
      lines.push(`🔧 <b>Appliance:</b> ${escapeHtml(data.appliance)}`);
    }

    if (data.preferredDate || data.preferredTimeSlot) {
      let when = '';
      if (data.preferredDate) {
        const d = new Date(data.preferredDate + 'T00:00:00');
        when = isNaN(d.getTime())
          ? data.preferredDate
          : d.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
      }
      if (data.preferredTimeSlot) {
        when = when ? `${when} · ${data.preferredTimeSlot}` : data.preferredTimeSlot;
      }
      lines.push(`📅 <b>Preferred:</b> ${escapeHtml(when)}`);
    }

    const attribution = data.attribution || {};
    const utmSource = attribution.utm_source || '';
    const utmMedium = attribution.utm_medium || '';
    const utmCampaign = attribution.utm_campaign || '';
    const utmContent = attribution.utm_content || '';
    const utmTerm = attribution.utm_term || '';
    const gclid = attribution.gclid || '';
    const gbraid = attribution.gbraid || '';
    const wbraid = attribution.wbraid || '';
    const fbclid = attribution.fbclid || '';
    const msclkid = attribution.msclkid || '';
    const landingPage = attribution.landing_page || '';
    const landingReferrer = attribution.landing_referrer || '';

    const hasAttribution =
      utmSource || utmMedium || utmCampaign || utmContent || utmTerm ||
      gclid || gbraid || wbraid || fbclid || msclkid;

    lines.push('');
    lines.push('━━━━━━━━━━━━━━━━━');
    lines.push('📊 <b>Attribution</b>');

    if (hasAttribution) {
      const trafficLabel = utmSource
        ? `${utmSource}${utmMedium ? ' / ' + utmMedium : ''}`
        : gclid
          ? 'google ads (gclid)'
          : fbclid
            ? 'facebook (fbclid)'
            : msclkid
              ? 'microsoft ads (msclkid)'
              : 'paid (untagged)';
      lines.push(`📣 <b>Source:</b> ${escapeHtml(trafficLabel)}`);
      if (utmCampaign) lines.push(`🎯 <b>Campaign:</b> ${escapeHtml(utmCampaign)}`);
      if (utmContent) lines.push(`🧩 <b>Content:</b> ${escapeHtml(utmContent)}`);
      if (utmTerm) lines.push(`🔑 <b>Term:</b> ${escapeHtml(utmTerm)}`);
      if (gclid) lines.push(`🆔 <b>gclid:</b> <code>${escapeHtml(gclid)}</code>`);
      if (gbraid) lines.push(`🆔 <b>gbraid:</b> <code>${escapeHtml(gbraid)}</code>`);
      if (wbraid) lines.push(`🆔 <b>wbraid:</b> <code>${escapeHtml(wbraid)}</code>`);
      if (fbclid) lines.push(`🆔 <b>fbclid:</b> <code>${escapeHtml(fbclid)}</code>`);
      if (msclkid) lines.push(`🆔 <b>msclkid:</b> <code>${escapeHtml(msclkid)}</code>`);
    } else {
      lines.push(`📣 <b>Source:</b> direct / organic`);
    }
    if (landingPage) lines.push(`🛬 <b>Landing:</b> ${escapeHtml(landingPage)}`);
    if (landingReferrer) lines.push(`↩️ <b>Referrer:</b> ${escapeHtml(landingReferrer)}`);

    lines.push('');
    lines.push(`🌐 <b>Submitted from:</b> ${escapeHtml(data.submission_page || sourceUrl)}`);
    lines.push(`🕐 <b>Time:</b> ${escapeHtml(timestamp)} (Fort Worth)`);

    const text = lines.join('\n');

    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    if (!tgRes.ok) {
      const body = await tgRes.text();
      console.error('[TELEGRAM] sendMessage failed:', tgRes.status, body);
      if (slotReserved) await releaseSlot(bookingDate, bookingSlot);
      return NextResponse.json(
        { error: 'Notification failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Lead submitted successfully',
    });
  } catch (error) {
    console.error('Lead submission error:', error);
    if (slotReserved) await releaseSlot(bookingDate, bookingSlot);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
