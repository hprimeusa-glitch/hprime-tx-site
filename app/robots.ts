import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // NOTE: /_next/ must stay crawlable. Every image is served through /_next/image
  // and the CSS/JS Google needs to render pages lives under /_next/static.
  // Blocking it kept images out of Google Images and degraded rendering.
  const baseUrl = 'https://tx.h-prime-co.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/keystatic/',
          '/admin/',
          '/test-geo/',
        ],
        crawlDelay: 1, // 1 second between requests (prevents server overload)
      },
      // Specific rules for major search engines
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/keystatic/',
          '/admin/',
        ],
        crawlDelay: 0.5, // Google can crawl faster
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/keystatic/',
          '/admin/',
          '/test-geo/',
        ],
        crawlDelay: 1,
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-phase1.xml`,
      `${baseUrl}/sitemap-phase2.xml`,
      `${baseUrl}/sitemap-phase3.xml`,
    ],
  };
}
