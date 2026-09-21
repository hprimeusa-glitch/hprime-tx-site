import { Metadata } from 'next';
import { isCityIndexed } from '@/lib/data/cities';

interface SEOParams {
  city?: string;
  appliance?: string;
  brand?: string;
  county?: string;
}

const SITE_NAME = 'H-Prime Appliance Repair Services';
const SITE_URL = 'https://tx.h-prime-co.com';
const PHONE = '(817) 799-6313';

export function generatePageMetadata(params: SEOParams): Metadata {
  const { city, appliance, brand, county } = params;

  let title = '';
  let description = '';

  if (city && brand && appliance) {
    const cityName = formatCityName(city);
    const brandName = formatBrandName(brand);
    const applianceName = formatApplianceName(appliance);
    title = `Expert ${brandName} ${applianceName} Repair in ${cityName}, TX | Same-Day Service`;
    description = `Professional ${brandName} ${applianceName} repair in ${cityName}, TX. Certified technicians, same-day service, upfront pricing. Call ${PHONE} for ${brandName} appliance repairs!`;
  } else if (city && brand) {
    const cityName = formatCityName(city);
    const brandName = formatBrandName(brand);
    title = `${brandName} Appliance Repair in ${cityName}, TX | Expert ${brandName} Service`;
    description = `Trusted ${brandName} appliance repair in ${cityName}, TX. We service all ${brandName} appliances. Same-day service available. Call ${PHONE} now!`;
  } else if (city && appliance) {
    const cityName = formatCityName(city);
    const applianceName = formatApplianceName(appliance);
    title = `${cityName} ${applianceName} Repair | Same-Day Service | ${SITE_NAME}`;
    description = `Expert ${applianceName} repair in ${cityName}, TX. Same-day service, certified technicians, upfront pricing. Call ${PHONE} for professional ${applianceName} repair!`;
  } else if (brand && appliance) {
    const brandName = formatBrandName(brand);
    const applianceName = formatApplianceName(appliance);
    title = `${brandName} ${applianceName} Repair Fort Worth Metro | Expert ${brandName} Service`;
    description = `Professional ${brandName} ${applianceName} repair in the Fort Worth Metro area. Same-day service, upfront pricing. Call ${PHONE}!`;
  } else if (city) {
    const cityName = formatCityName(city);
    title = `Appliance Repair ${cityName}, TX | Same-Day Service | ${SITE_NAME}`;
    description = `Professional appliance repair in ${cityName}, TX. Expert service for refrigerators, washers, dryers, ovens & more. Same-day service available. Call ${PHONE}!`;
  } else if (brand) {
    const brandName = formatBrandName(brand);
    title = `${brandName} Appliance Repair Fort Worth Metro | ${SITE_NAME}`;
    description = `Expert ${brandName} appliance repair across the Fort Worth Metro area. All major ${brandName} appliances. Same-day service. Call ${PHONE}!`;
  } else if (appliance) {
    const applianceName = formatApplianceName(appliance);
    title = `${applianceName} Repair Fort Worth Metro | Same-Day Service | ${SITE_NAME}`;
    description = `Expert ${applianceName} repair in the Fort Worth Metro area. Certified technicians, same-day service, all major brands. Call ${PHONE} for professional ${applianceName} repair!`;
  } else {
    title = `${SITE_NAME} | Expert Appliance Repair in Fort Worth, TX`;
    description = `Professional appliance repair in the Fort Worth Metro area. Same-day service, certified technicians. Repair all major brands - refrigerators, washers, dryers & more. Call ${PHONE}!`;
  }

  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  const canonicalUrl = buildCanonicalUrl(params);
  const ogImageUrl = `${SITE_URL}/logo-original.jpg`;

  // Cities added in the 2026-09-21 West DFW expansion are live for ads traffic
  // but held out of the index until they earn impressions. One check here covers
  // all four city route levels: /cities/[city] and its services, brands and
  // brand+service children. Flip `indexed` in lib/data/cities.ts to release one.
  const noindex = Boolean(city) && !isCityIndexed(city as string);

  return {
    title: fullTitle,
    description,
    ...(noindex && {
      robots: {
        index: false,
        follow: true,
        googleBot: { index: false, follow: true },
      },
    }),
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      type: 'website',
      locale: 'en_US',
      siteName: SITE_NAME,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

function formatCityName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatBrandName(slug: string): string {
  const brandMap: { [key: string]: string } = {
    'lg': 'LG',
    'ge': 'GE',
    'kitchenaid': 'KitchenAid',
    'sub-zero': 'Sub-Zero',
    'jennair': 'JennAir',
    'u-line': 'U-Line',
    'fisher-paykel': 'Fisher & Paykel',
    'ice-o-matic': 'Ice-O-Matic',
    'black-decker': 'Black & Decker',
  };

  if (brandMap[slug]) return brandMap[slug];

  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatApplianceName(slug: string): string {
  const applianceMap: { [key: string]: string } = {
    'refrigerator': 'Refrigerator',
    'washer': 'Washer',
    'dryer': 'Dryer',
    'dishwasher': 'Dishwasher',
    'oven': 'Oven',
    'cooktop': 'Cooktop',
    'freezer': 'Freezer',
    'garbage-disposal': 'Garbage Disposal',
    'gas-dryer': 'Gas Dryer',
    'grill': 'Grill & BBQ',
    'ice-machine': 'Ice Machine',
    'microwave': 'Microwave',
    'vent-hood': 'Vent Hood',
    'wine-cooler': 'Wine Cooler',
    'trash-compactor': 'Trash Compactor',
  };

  return applianceMap[slug] || slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function buildCanonicalUrl(params: SEOParams): string {
  const { city, appliance, brand } = params;

  let path = '';

  if (city && brand && appliance) {
    path = `/cities/${city}/brands/${brand}/services/${appliance}-repair`;
  } else if (city && brand) {
    path = `/cities/${city}/brands/${brand}-repair`;
  } else if (city && appliance) {
    path = `/cities/${city}/services/${appliance}-repair`;
  } else if (brand && appliance) {
    path = `/brands/${brand}-repair/services/${appliance}-repair`;
  } else if (city) {
    path = `/cities/${city}`;
  } else if (brand) {
    path = `/brands/${brand}-repair`;
  } else if (appliance) {
    path = `/services/${appliance}-repair`;
  } else {
    path = '/';
  }

  return `${SITE_URL}${path}`;
}
