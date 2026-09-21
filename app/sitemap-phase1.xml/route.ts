import { MetadataRoute } from 'next';
import { appliances } from '@/lib/data/appliances';
import { brands } from '@/lib/data/brands';
import { getIndexedCities } from '@/lib/data/cities';

/**
 * PHASE 1 SITEMAP
 * Core pages, all 15 services, indexed cities, top-20 brands
 *
 * Only cities flagged `indexed` in lib/data/cities.ts appear here. The West DFW
 * cities added on 2026-09-21 serve ads traffic under noindex and are excluded.
 */
export async function GET() {
  const baseUrl = 'https://tx.h-prime-co.com';
  const now = new Date().toISOString();

  // Service area cities eligible for indexing
  const topCities = getIndexedCities();

  // Top 20 most popular brands
  const topBrands = brands.slice(0, 20);

  const routes: MetadataRoute.Sitemap = [
    // Core pages (highest priority)
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/book`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/service-areas`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    // All service pages (15 pages) - HIGH PRIORITY
    ...appliances.map((appliance) => ({
      url: `${baseUrl}/services/${appliance.slug}-repair`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),

    // Indexed city pages
    ...topCities.map((city) => ({
      url: `${baseUrl}/cities/${city.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),

    // Top 20 brand pages
    ...topBrands.map((brand) => ({
      url: `${baseUrl}/brands/${brand.slug}-repair`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),

    // Commercial page
    {
      url: `${baseUrl}/commercial`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },

    // Legal pages are noindex — intentionally excluded from the sitemap
  ];

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${route.url}</loc>
    <lastmod>${route.lastModified}</lastmod>
    <changefreq>${route.changeFrequency}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
