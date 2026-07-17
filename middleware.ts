// Edge Middleware for Google Ads Geolocation
// File: /middleware.ts (root of project)
// Purpose: Intercept ad traffic and rewrite URLs to add city-specific path

import { NextRequest, NextResponse } from 'next/server';
import { geolocation } from '@vercel/edge';

export const config = {
  matcher: [
    '/services/:path*',
    '/brands/:path*',
  ],
};

// ============================================
// CITY MAPPING (Fort Worth Metro Area - TX)
// ============================================
const CITY_NAME_TO_SLUG: Record<string, string> = {
  // Tarrant County
  'Fort Worth': 'fort-worth',
  'Keller': 'keller',
  'North Richland Hills': 'north-richland-hills',
  'Richland Hills': 'north-richland-hills',
  'Haltom City': 'haltom-city',
  'Watauga': 'fort-worth',
  'Saginaw': 'fort-worth',
  'White Settlement': 'fort-worth',
  'Benbrook': 'fort-worth',
  'Hurst': 'hurst',
  'Euless': 'euless',
  'Bedford': 'bedford',
  'Colleyville': 'colleyville',
  'Southlake': 'southlake',
  'Grapevine': 'colleyville',
};

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const utmSource = searchParams.get('utm_source');
  const utmMedium = searchParams.get('utm_medium');

  // If NOT ad traffic → pass through
  if (utmSource !== 'google' || utmMedium !== 'cpc') {
    return NextResponse.next();
  }

  const geo = geolocation(request);
  const rawCityName = geo.city;
  const cityName = rawCityName ? decodeURIComponent(rawCityName) : null;

  console.log('[GEO-MIDDLEWARE] Detected location:', {
    city: cityName,
    region: geo.region,
    country: geo.country,
  });

  // Default to Fort Worth if no city detected
  if (!cityName) {
    console.log('[GEO-MIDDLEWARE] No city detected, using Fort Worth as default');
    const url = request.nextUrl.clone();

    if (pathname.match(/^\/services\/.+/)) {
      const servicePath = pathname.replace('/services/', '');
      url.pathname = `/cities/fort-worth/services/${servicePath}`;
      return NextResponse.rewrite(url);
    }

    return NextResponse.next();
  }

  let citySlug = CITY_NAME_TO_SLUG[cityName];

  // Try case-insensitive if not found
  if (!citySlug) {
    const cityNameLower = cityName.toLowerCase();
    const matchedKey = Object.keys(CITY_NAME_TO_SLUG).find(
      key => key.toLowerCase() === cityNameLower
    );
    if (matchedKey) {
      citySlug = CITY_NAME_TO_SLUG[matchedKey];
    }
  }

  // If city not found → use Fort Worth as default
  if (!citySlug) {
    console.log('[GEO-MIDDLEWARE] City not in service area, using Fort Worth as default');
    citySlug = 'fort-worth';
  }

  let newPathname = pathname;

  // Pattern 1: /services/[appliance]-repair → /cities/[city]/services/[appliance]-repair
  if (pathname.match(/^\/services\/.+/)) {
    const servicePath = pathname.replace('/services/', '');
    newPathname = `/cities/${citySlug}/services/${servicePath}`;
  }

  // Pattern 2: /brands/[brand]/services/[appliance]-repair
  else if (pathname.match(/^\/brands\/[^\/]+\/services\/.+/)) {
    const brandAndService = pathname.replace('/brands/', '');
    const [brand, , ...rest] = brandAndService.split('/');
    const servicePath = rest.join('/');
    newPathname = `/cities/${citySlug}/brands/${brand}/services/${servicePath}`;
  }

  if (newPathname === pathname) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = newPathname;

  console.log('[GEO-MIDDLEWARE] Rewrite:', {
    from: pathname,
    to: newPathname,
    city: cityName,
    slug: citySlug,
  });

  return NextResponse.rewrite(url);
}
