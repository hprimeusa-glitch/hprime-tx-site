/**
 * MAIN SITEMAP INDEX
 *
 * Must emit <sitemapindex>, not <urlset>. The previous app/sitemap.ts returned
 * Next's MetadataRoute.Sitemap, which renders a <urlset> — so Google read the
 * phased sitemaps as ordinary pages, crawled them, found no canonical on an XML
 * document and filed them under "Duplicate without user-selected canonical".
 *
 * Uncomment a phase here once the previous one is indexed.
 */
export async function GET() {
  const baseUrl = 'https://tx.h-prime-co.com';
  const now = new Date().toISOString();

  const sitemaps = [
    `${baseUrl}/sitemap-phase1.xml`,
    `${baseUrl}/sitemap-phase2.xml`,
    `${baseUrl}/sitemap-phase3.xml`,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (loc) => `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
