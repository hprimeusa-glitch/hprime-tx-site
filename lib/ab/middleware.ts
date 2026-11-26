// Edge helper. Call abPrepare(req) at the very top of middleware, pass
// `{ request: { headers: prep.requestHeaders } }` into NextResponse.next()/rewrite(), and
// abApply(res, prep) on whatever response the middleware returns (redirects included).
// This makes ab_uid visible to server components on the FIRST request, so server-rendered
// variants never flicker and never disagree with the browser.
import type { NextRequest, NextResponse } from 'next/server';
import { UID_COOKIE, PAID_COOKIE, UID_MAX_AGE, isValidUid, newUid, isPaidLanding } from './core';

export type AbPrep = { uid: string; isNew: boolean; paid: boolean; requestHeaders: Headers };

export function abPrepare(req: NextRequest): AbPrep {
  const existing = req.cookies.get(UID_COOKIE)?.value;
  const isNew = !isValidUid(existing);
  const uid = isNew ? newUid() : (existing as string);
  const paid = isPaidLanding(req.nextUrl.searchParams);
  const requestHeaders = new Headers(req.headers);
  if (isNew || paid) {
    const parts = (req.headers.get('cookie') || '').split(/;\s*/).filter((c) => c && !c.startsWith(`${UID_COOKIE}=`) && !(paid && c.startsWith(`${PAID_COOKIE}=`)));
    parts.push(`${UID_COOKIE}=${uid}`);
    if (paid) parts.push(`${PAID_COOKIE}=1`);
    requestHeaders.set('cookie', parts.join('; '));
  }
  return { uid, isNew, paid, requestHeaders };
}

export function abApply<T extends NextResponse>(res: T, prep: AbPrep): T {
  if (prep.isNew) res.cookies.set(UID_COOKIE, prep.uid, { path: '/', maxAge: UID_MAX_AGE, sameSite: 'lax', secure: true });
  // Session cookie: "this visit came from a Google ad". Re-set on every paid landing.
  if (prep.paid) res.cookies.set(PAID_COOKIE, '1', { path: '/', sameSite: 'lax', secure: true });
  return res;
}
