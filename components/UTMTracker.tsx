'use client';

import { useEffect } from 'react';

const TRACKING_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
  'msclkid',
] as const;

const STORAGE_KEY = 'hprime_attribution';

export default function UTMTracker() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const captured: Record<string, string> = {};
      for (const key of TRACKING_PARAMS) {
        const value = params.get(key);
        if (value) captured[key] = value;
      }

      if (Object.keys(captured).length === 0) return;

      const existingRaw = sessionStorage.getItem(STORAGE_KEY);
      const existing = existingRaw ? JSON.parse(existingRaw) : {};

      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...captured,
          ...existing,
          landing_page: existing.landing_page || window.location.pathname,
          landing_referrer: existing.landing_referrer || document.referrer || '',
          captured_at: existing.captured_at || new Date().toISOString(),
        })
      );
    } catch {
      // sessionStorage may be blocked; silently ignore
    }
  }, []);

  return null;
}
