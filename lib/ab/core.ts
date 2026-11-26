// A/B core — isomorphic (edge, node, browser). Copied verbatim into every site's lib/ab/.
// Source of truth: /root/My-Digital-Brain/scripts/ab-tests/sdk/. Do not fork per site;
// only config.ts is site-specific.
//
// Assignment is deterministic: variant = f(ab_uid, experiment id, salt). The only state is the
// first-party `ab_uid` cookie, so the edge middleware, server components, the browser and the
// lead API route always agree without any shared store.
import { EXPERIMENTS, type Experiment } from './config';

export const UID_COOKIE = 'ab_uid';
export const PAID_COOKIE = 'ab_paid';
export const UID_MAX_AGE = 60 * 60 * 24 * 400; // 400 days (browser cap)
export const COLLECT_PATH = '/api/ab';

export type AbEvent = 'exposure' | 'form_open' | 'form_start' | 'phone_click' | 'lead' | 'chat_lead';

// FNV-1a 32-bit — tiny, fast, identical in every runtime.
export function fnv1a(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

export function newUid(): string {
  const a = new Uint8Array(12);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(36).padStart(2, '0')).join('').slice(0, 20);
}

export function isValidUid(v: string | undefined | null): v is string {
  return !!v && /^[A-Za-z0-9_-]{8,40}$/.test(v);
}

export function findExperiment(id: string): Experiment | undefined {
  return EXPERIMENTS.find((e) => e.id === id);
}

/** Variant this uid sees. Finished experiments return the winner to everyone; paused → control. */
export function variantFor(exp: Experiment, uid: string | null | undefined): string {
  if (exp.status === 'done') return exp.winner ?? exp.variants[0];
  if (exp.status !== 'running' || !isValidUid(uid)) return exp.variants[0];
  const weights = exp.weights ?? exp.variants.map(() => 1);
  const total = weights.reduce((a, b) => a + b, 0);
  const point = (fnv1a(`${uid}:${exp.id}:${exp.salt ?? ''}`) % 10000) / 10000 * total;
  let acc = 0;
  for (let i = 0; i < exp.variants.length; i++) {
    acc += weights[i];
    if (point < acc) return exp.variants[i];
  }
  return exp.variants[exp.variants.length - 1];
}

export function runningExperiments(): Experiment[] {
  return EXPERIMENTS.filter((e) => e.status === 'running');
}

/** Map of running experiment id → variant, e.g. for dataLayer / Clarity tags. */
export function assignments(uid: string | null | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  for (const e of runningExperiments()) out[e.id] = variantFor(e, uid);
  return out;
}

export function isPaidLanding(params: URLSearchParams): boolean {
  return params.has('gclid') || params.has('gbraid') || params.has('wbraid') ||
    (params.get('utm_source') || '').startsWith('google');
}

export function deviceFromUa(ua: string): 'mobile' | 'tablet' | 'desktop' {
  if (/iPad|Tablet|Nexus 7|Nexus 10|SM-T|Kindle|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) return 'tablet';
  if (/Mobi|iPhone|iPod|Android.*Mobile|Windows Phone/i.test(ua)) return 'mobile';
  return 'desktop';
}

export const BOT_UA = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit|bingpreview|google-inspectiontool|chrome-lighthouse|python|curl|wget|axios|node-fetch|go-http/i;
