'use client';
// Browser helpers.
//  <AbRuntime />            — mount ONCE in the root layout (inside <body>). Ensures ab_uid when the
//                             middleware did not run (static pages), tags Clarity + dataLayer with
//                             running assignments, and records tel: clicks as 'phone_click'.
//  useVariant(id)           — variant for client components (popup forms, sticky bars).
//  <AbExposure id="..." />  — render next to the element under test; records one exposure per
//                             page view. Exposure = "this visitor actually saw the tested element".
//  abTrack('form_open')     — call from form open / start handlers. Leads are recorded server-side
//                             in the lead API route (abTrackServer), not here.
import { useEffect, useState } from 'react';
import { COLLECT_PATH, PAID_COOKIE, UID_COOKIE, UID_MAX_AGE, assignments, findExperiment, isPaidLanding, isValidUid, newUid, runningExperiments, variantFor, type AbEvent } from './core';

declare global {
  interface Window { dataLayer?: unknown[]; clarity?: (...args: unknown[]) => void; __abQ?: { exp_id: string; event: AbEvent; path: string }[]; __abT?: number }
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const m = new RegExp(`(?:^|;\\s*)${name}=([^;]*)`).exec(document.cookie);
  return m ? decodeURIComponent(m[1]) : null;
}

export function getUid(): string | null {
  let uid = readCookie(UID_COOKIE);
  if (!isValidUid(uid) && typeof document !== 'undefined') {
    uid = newUid();
    document.cookie = `${UID_COOKIE}=${uid}; path=/; max-age=${UID_MAX_AGE}; samesite=lax; secure`;
  }
  return uid;
}

function flush() {
  const q = window.__abQ;
  window.__abQ = [];
  window.__abT = undefined;
  if (!q || !q.length) return;
  const body = JSON.stringify({ events: q });
  try {
    if (!navigator.sendBeacon?.(COLLECT_PATH, new Blob([body], { type: 'application/json' }))) {
      void fetch(COLLECT_PATH, { method: 'POST', body, headers: { 'content-type': 'application/json' }, keepalive: true });
    }
  } catch { /* best-effort */ }
}

function enqueue(exp_id: string, event: AbEvent) {
  if (typeof window === 'undefined') return;
  (window.__abQ ||= []).push({ exp_id, event, path: location.pathname });
  // tel: and lead events flush immediately (the page may unload); exposures batch for 1.5 s.
  if (event !== 'exposure') return flush();
  if (!window.__abT) window.__abT = window.setTimeout(flush, 1500);
}

/** Conversion / funnel event for every running experiment (analysis keeps only exposed uids). */
export function abTrack(event: AbEvent) {
  if (typeof window === 'undefined') return;
  getUid();
  for (const e of runningExperiments()) enqueue(e.id, event);
}

export function useVariant(expId: string): string | null {
  const exp = findExperiment(expId);
  const [v, setV] = useState<string | null>(exp && exp.status !== 'running' ? variantFor(exp, null) : null);
  useEffect(() => { if (exp) setV(variantFor(exp, getUid())); }, [expId]); // eslint-disable-line react-hooks/exhaustive-deps
  return v; // null until mounted for running experiments: render the control or nothing meanwhile
}

const seen = new Set<string>();
/**
 * `rendered` = the variant the element was actually rendered with (pass it from server
 * components: <AbExposure id="x" rendered={v} />). If it differs from the uid's assignment
 * (e.g. SSR ran before the cookie existed on a path outside the middleware matcher) the exposure
 * is NOT recorded, so a mismatch can never pollute the data. Fix the matcher if you see the
 * console warning.
 */
export function AbExposure({ id, rendered }: { id: string; rendered?: string | null }) {
  useEffect(() => {
    const exp = findExperiment(id);
    if (!exp || exp.status !== 'running') return;
    const assigned = variantFor(exp, getUid());
    if (rendered && rendered !== assigned) {
      console.warn(`[ab] ${id}: rendered ${rendered} but assigned ${assigned}; exposure skipped (middleware matcher gap?)`);
      return;
    }
    const key = `${id}:${location.pathname}`;
    if (seen.has(key)) return;
    seen.add(key);
    enqueue(id, 'exposure');
  }, [id, rendered]);
  return null;
}

export function AbRuntime() {
  useEffect(() => {
    const uid = getUid();
    if (isPaidLanding(new URLSearchParams(location.search))) document.cookie = `${PAID_COOKIE}=1; path=/; samesite=lax; secure`;
    const a = assignments(uid);
    const tag = Object.entries(a).map(([k, v]) => `${k}:${v}`).join(',');
    if (tag) {
      (window.dataLayer ||= []).push({ event: 'ab_assign', ab_variants: tag });
      const setClarity = () => { for (const [k, v] of Object.entries(a)) window.clarity?.('set', `ab_${k}`, v); };
      setClarity();
      window.setTimeout(setClarity, 4000); // Clarity often loads after hydration (GTM)
    }
    const onClick = (ev: MouseEvent) => {
      const el = (ev.target as Element | null)?.closest?.('a[href^="tel:"]');
      if (el) abTrack('phone_click');
    };
    document.addEventListener('click', onClick, { capture: true });
    const onHide = () => { if (document.visibilityState === 'hidden') flush(); };
    document.addEventListener('visibilitychange', onHide);
    return () => { document.removeEventListener('click', onClick, { capture: true }); document.removeEventListener('visibilitychange', onHide); };
  }, []);
  return null;
}
