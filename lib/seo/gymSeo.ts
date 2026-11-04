import type { Metadata } from 'next';
import { PHONE_DISPLAY, BUSINESS_NAME } from '@/lib/utils';
import type { GymFaq } from '@/lib/data/gymServices';

const SITE_URL = 'https://tx.h-prime-co.com';

interface GymMetaParams {
  /** path starting with /gym */
  path: string;
  title: string;
  description: string;
  indexable: boolean;
}

/**
 * Metadata for the /gym section. Every page is self-canonical. Indexable pages
 * render `index, follow`; the rest `noindex, follow` and stay out of the sitemaps.
 */
export function gymMetadata({ path, title, description, indexable }: GymMetaParams): Metadata {
  const url = `${SITE_URL}${path}`;
  const robots = indexable
    ? { index: true, follow: true, googleBot: { index: true, follow: true } }
    : { index: false, follow: true, googleBot: { index: false, follow: true } };

  return {
    title,
    description,
    robots,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: 'en_US',
      siteName: BUSINESS_NAME,
      images: [{ url: `${SITE_URL}/logo-original.jpg`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/logo-original.jpg`],
    },
  };
}

const AREA_SERVED = [
  { '@type': 'Place', name: 'Dallas-Fort Worth, TX' },
  { '@type': 'City', name: 'Fort Worth', containedInPlace: { '@type': 'State', name: 'Texas' } },
  { '@type': 'City', name: 'Arlington', containedInPlace: { '@type': 'State', name: 'Texas' } },
  { '@type': 'City', name: 'Irving', containedInPlace: { '@type': 'State', name: 'Texas' } },
  { '@type': 'City', name: 'Houston', containedInPlace: { '@type': 'State', name: 'Texas' } },
];

export function gymServiceSchema(params: { path: string; name: string; serviceType: string; description: string }) {
  const url = `${SITE_URL}${params.path}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: params.name,
    serviceType: params.serviceType,
    description: params.description,
    url,
    provider: { '@id': `${SITE_URL}#organization` },
    areaServed: AREA_SERVED,
    availableChannel: {
      '@type': 'ServiceChannel',
      servicePhone: { '@type': 'ContactPoint', telephone: PHONE_DISPLAY, contactType: 'customer service' },
      serviceUrl: url,
    },
  };
}

export function gymFaqSchema(faqs: GymFaq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function gymBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
