// Texas service regions - H-Prime Appliance Repair Services
// Kept in sync with lib/data/cities.ts (county slugs must match).
//
// Each county belongs to one market. City-level copy names the market a page
// sits in, so a Houston page never talks about Fort Worth and the reverse.

export type Market = 'dfw' | 'houston';

export const markets: Record<Market, { name: string }> = {
  dfw: { name: 'Dallas-Fort Worth' },
  houston: { name: 'Houston' },
};

export const counties: { slug: string; name: string; market: Market }[] = [
  { slug: 'tarrant', name: 'Tarrant County', market: 'dfw' },
  { slug: 'dallas', name: 'Dallas County', market: 'dfw' },
  { slug: 'denton', name: 'Denton County', market: 'dfw' },
  { slug: 'johnson', name: 'Johnson County', market: 'dfw' },
  { slug: 'harris', name: 'Harris County', market: 'houston' },
];

/** Market display name for a county, defaulting to Dallas-Fort Worth. */
export function getMarketName(countySlug?: string): string {
  const market = counties.find((c) => c.slug === countySlug)?.market ?? 'dfw';
  return markets[market].name;
}
