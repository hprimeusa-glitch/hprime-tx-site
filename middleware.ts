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
// CITY MAPPING (Texas: west Dallas-Fort Worth + Houston)
// ============================================
// Every city with its own page in lib/data/cities.ts maps to itself; smaller
// municipalities inside our ZIPs map to the page that covers them.
const CITY_NAME_TO_SLUG: Record<string, string> = {
  // Dallas-Fort Worth - Tarrant County
  'Fort Worth': 'fort-worth',
  'Keller': 'keller',
  'North Richland Hills': 'north-richland-hills',
  'Richland Hills': 'north-richland-hills',
  'Haltom City': 'haltom-city',
  'Watauga': 'fort-worth',
  'Saginaw': 'fort-worth',
  'White Settlement': 'fort-worth',
  'Benbrook': 'fort-worth',
  'Forest Hill': 'fort-worth',
  'Everman': 'fort-worth',
  'Hurst': 'hurst',
  'Euless': 'euless',
  'Bedford': 'bedford',
  'Colleyville': 'colleyville',
  'Southlake': 'southlake',
  'Grapevine': 'grapevine',
  'Arlington': 'arlington',
  'Pantego': 'arlington',
  'Dalworthington Gardens': 'arlington',
  'Mansfield': 'mansfield',
  'Kennedale': 'kennedale',
  'Crowley': 'crowley',
  'Haslet': 'haslet',
  // Dallas-Fort Worth - Dallas, Denton and Johnson counties
  'Dallas': 'dallas',
  'Irving': 'irving',
  'Grand Prairie': 'grand-prairie',
  'Coppell': 'coppell',
  'Carrollton': 'carrollton',
  'Farmers Branch': 'farmers-branch',
  'Lewisville': 'lewisville',
  'Highland Village': 'lewisville',
  'Flower Mound': 'flower-mound',
  'Justin': 'justin',
  'Roanoke': 'roanoke',
  'Trophy Club': 'roanoke',
  'Argyle': 'argyle',
  'Burleson': 'burleson',
  // Houston - Harris County
  'Houston': 'houston',
  'Bellaire': 'bellaire',
  'West University Place': 'houston',
  'Southside Place': 'houston',
  'Piney Point Village': 'houston',
  'Hunters Creek Village': 'houston',
  'Bunker Hill Village': 'houston',
  'Hedwig Village': 'houston',
  'Spring Valley Village': 'houston',
  'Hilshire Village': 'houston',
  'Jersey Village': 'houston',
};

// An unknown or missing city falls back to the nearer market. Houston sits
// near 29.8N, Dallas-Fort Worth near 32.8N; 31N splits them cleanly.
function fallbackCitySlug(latitude?: string): string {
  const lat = latitude ? parseFloat(latitude) : NaN;
  return !Number.isNaN(lat) && lat < 31 ? 'houston' : 'fort-worth';
}

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

  // No city detected: pick the nearer market by latitude
  if (!cityName) {
    const fallback = fallbackCitySlug(geo.latitude);
    console.log('[GEO-MIDDLEWARE] No city detected, using fallback:', fallback);
    const url = request.nextUrl.clone();

    if (pathname.match(/^\/services\/.+/)) {
      const servicePath = pathname.replace('/services/', '');
      url.pathname = `/cities/${fallback}/services/${servicePath}`;
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

  // If city not found → use the nearer market
  if (!citySlug) {
    citySlug = fallbackCitySlug(geo.latitude);
    console.log('[GEO-MIDDLEWARE] City not in service area, using fallback:', citySlug);
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
