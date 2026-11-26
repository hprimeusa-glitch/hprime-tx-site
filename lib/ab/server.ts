// Server-only helpers: variant lookup for server components and conversion tracking for API
// routes (lead submit). Never throws, never blocks a lead longer than 1.5 s.
// Import only from server components and route handlers (uses next/headers).
import { cookies, headers } from 'next/headers';
import { AB_SITE, AB_KEY, AB_COLLECTOR_URL } from './config';
import { UID_COOKIE, PAID_COOKIE, BOT_UA, deviceFromUa, findExperiment, isValidUid, runningExperiments, variantFor, type AbEvent } from './core';

/** Variant for a server component. Requires the path to be covered by the middleware matcher. */
export async function getVariant(expId: string): Promise<string> {
  const exp = findExperiment(expId);
  if (!exp) return 'A';
  const uid = (await cookies()).get(UID_COOKIE)?.value;
  return variantFor(exp, uid);
}

type Row = { exp_id: string; variant: string; uid: string; event: AbEvent; path?: string | null; device?: string; is_paid?: boolean; country?: string | null; meta?: Record<string, unknown> };

export async function sendToCollector(rows: Row[]): Promise<void> {
  if (!rows.length || AB_SITE === 'CHANGE-ME') return;
  try {
    await fetch(AB_COLLECTOR_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ site: AB_SITE, key: AB_KEY, events: rows }),
      signal: AbortSignal.timeout(1500),
      cache: 'no-store',
    });
  } catch {
    /* best-effort: A/B tracking must never break the page or the lead */
  }
}

/**
 * Record a conversion for every running experiment from inside an API route
 * (e.g. /api/submit-lead after successful delivery). Reads ab_uid from the request cookies.
 * Usage: await abTrackServer(req, 'lead', { form: 'quote' })
 */
export async function abTrackServer(req: Request, event: AbEvent, meta?: Record<string, unknown>): Promise<void> {
  try {
    const cookie = req.headers.get('cookie') || '';
    const uid = /(?:^|;\s*)ab_uid=([^;]+)/.exec(cookie)?.[1];
    if (!isValidUid(uid)) return;
    const ua = req.headers.get('user-agent') || '';
    if (BOT_UA.test(ua)) return;
    const paid = new RegExp(`(?:^|;\\s*)${PAID_COOKIE}=1`).test(cookie);
    const referer = req.headers.get('referer');
    let path: string | null = null;
    try { path = referer ? new URL(referer).pathname : null; } catch { path = null; }
    const rows: Row[] = runningExperiments().map((e) => ({
      exp_id: e.id, variant: variantFor(e, uid), uid, event, path,
      device: deviceFromUa(ua), is_paid: paid, country: req.headers.get('x-vercel-ip-country'), meta,
    }));
    await sendToCollector(rows);
  } catch {
    /* never throw */
  }
}

/** Same as abTrackServer but for server actions / RSC where there is no Request object. */
export async function abTrackFromHeaders(event: AbEvent, meta?: Record<string, unknown>): Promise<void> {
  try {
    const h = await headers();
    const req = new Request('https://local/', { headers: h });
    await abTrackServer(req, event, meta);
  } catch {
    /* never throw */
  }
}
