// Same-origin beacon endpoint for A/B events (ad-blockers do not cut first-party /api paths).
// The browser sends only {exp_id, event, path}; uid, variant, device, paid and country are derived
// HERE from cookies and headers, so a client can never report a variant it was not assigned.
// Copy to app/api/ab/route.ts (or src/app/api/ab/route.ts). Adjust the import path to lib/ab.
import { NextResponse } from 'next/server';
import { BOT_UA, PAID_COOKIE, UID_COOKIE, deviceFromUa, findExperiment, isValidUid, variantFor, type AbEvent } from '@/lib/ab/core';
import { sendToCollector } from '@/lib/ab/server';

const CLIENT_EVENTS = new Set<AbEvent>(['exposure', 'form_open', 'form_start', 'phone_click', 'lead', 'chat_lead']);

export async function POST(req: Request) {
  try {
    const origin = req.headers.get('origin');
    const host = req.headers.get('host');
    if (origin && host && new URL(origin).host !== host) return new NextResponse(null, { status: 204 });
    const ua = req.headers.get('user-agent') || '';
    if (BOT_UA.test(ua)) return new NextResponse(null, { status: 204 });
    const cookie = req.headers.get('cookie') || '';
    const uid = new RegExp(`(?:^|;\\s*)${UID_COOKIE}=([^;]+)`).exec(cookie)?.[1];
    if (!isValidUid(uid)) return new NextResponse(null, { status: 204 });
    const paid = new RegExp(`(?:^|;\\s*)${PAID_COOKIE}=1`).test(cookie);
    const body = await req.json().catch(() => null) as { events?: { exp_id?: string; event?: AbEvent; path?: string }[] } | null;
    const rows = (body?.events || []).slice(0, 30).flatMap((e) => {
      const exp = e.exp_id ? findExperiment(e.exp_id) : undefined;
      if (!exp || exp.status !== 'running' || !e.event || !CLIENT_EVENTS.has(e.event)) return [];
      return [{
        exp_id: exp.id, variant: variantFor(exp, uid), uid, event: e.event,
        path: typeof e.path === 'string' ? e.path.slice(0, 300) : null,
        device: deviceFromUa(ua), is_paid: paid, country: req.headers.get('x-vercel-ip-country'),
      }];
    });
    await sendToCollector(rows);
  } catch {
    /* best-effort */
  }
  return new NextResponse(null, { status: 204 });
}
