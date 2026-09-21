import { MetadataRoute } from 'next';
import { appliances } from '@/lib/data/appliances';
import { brands } from '@/lib/data/brands';
import { getIndexedCities } from '@/lib/data/cities';

/**
 * PHASE 2 SITEMAP
 * Remaining brand pages (44) + City+Appliance for indexed cities
 *
 * Mirrors phase 1: cities without `indexed` are served noindex and stay out.
 */
export async function GET() {
  const baseUrl = 'https://tx.h-prime-co.com';
  const now = new Date().toISOString();

  const routes: MetadataRoute.Sitemap = [
    // Remaining brand pages (brands 21-64)
    ...brands.slice(20).map((brand) => ({
      url: `${baseUrl}/brands/${brand.slug}-repair`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),

    // City + Appliance for indexed cities
    ...getIndexedCities().flatMap((city) =>
      appliances.map((appliance) => ({
        url: `${baseUrl}/cities/${city.slug}/services/${appliance.slug}-repair`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.85,
      }))
    ),
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
