// Texas service area - H-Prime Appliance Repair: west Dallas-Fort Worth and Houston
//
// ZIP codes mirror the Google Ads geo targeting one for one: DFW = campaign
// 24095002203 (89 ZIPs, expanded 2026-09-21 from the list the client sent on
// 2026-09-17), Houston = the Houston campaign (96 ZIPs since 2026-11-18, from the
// list the client sent that day).
// Only ZIPs with a live Google geo target constant are listed: PO-box-only and
// REMOVAL_PLANNED codes (76004, 76124, 76161 and 41 others) carry no residents.
//
// City grouping follows the USPS default city, corrected to the actual
// municipality where the two disagree (76127 NAS JRB -> Fort Worth,
// 75234 -> Farmers Branch).
//
// `indexed: false` keeps a city out of the sitemaps and serves it noindex.
// Flip to true once the city earns impressions - see lib/seo/metadata.ts.

export interface City {
  slug: string;
  name: string;
  county: string;
  zipCodes?: string[];
  /** Eligible for search indexing. New cities start false. */
  indexed?: boolean;
}

export const cities: City[] = [
  // --- Tarrant County core (indexed) ---
  { slug: 'fort-worth', name: 'Fort Worth', county: 'tarrant', indexed: true, zipCodes: ['76102', '76103', '76104', '76105', '76106', '76107', '76108', '76109', '76110', '76111', '76112', '76114', '76115', '76116', '76118', '76119', '76120', '76123', '76126', '76127', '76129', '76131', '76132', '76133', '76134', '76135', '76137', '76140', '76148', '76155', '76164', '76177', '76179'] },
  { slug: 'keller', name: 'Keller', county: 'tarrant', indexed: true, zipCodes: ['76244', '76248'] },
  { slug: 'north-richland-hills', name: 'North Richland Hills', county: 'tarrant', indexed: true, zipCodes: ['76180', '76182'] },
  { slug: 'haltom-city', name: 'Haltom City', county: 'tarrant', indexed: true, zipCodes: ['76117'] },
  { slug: 'hurst', name: 'Hurst', county: 'tarrant', indexed: true, zipCodes: ['76053', '76054'] },
  { slug: 'euless', name: 'Euless', county: 'tarrant', indexed: true, zipCodes: ['76039', '76040'] },
  { slug: 'bedford', name: 'Bedford', county: 'tarrant', indexed: true, zipCodes: ['76021', '76022'] },
  { slug: 'colleyville', name: 'Colleyville', county: 'tarrant', indexed: true, zipCodes: ['76034'] },
  { slug: 'southlake', name: 'Southlake', county: 'tarrant', indexed: true, zipCodes: ['76092'] },

  // --- Tarrant County expansion (2026-09-21, not indexed yet) ---
  { slug: 'arlington', name: 'Arlington', county: 'tarrant', indexed: false, zipCodes: ['76001', '76002', '76006', '76010', '76011', '76012', '76013', '76014', '76015', '76016', '76017', '76018'] },
  { slug: 'grapevine', name: 'Grapevine', county: 'tarrant', indexed: false, zipCodes: ['76051'] },
  { slug: 'mansfield', name: 'Mansfield', county: 'tarrant', indexed: false, zipCodes: ['76063'] },
  { slug: 'crowley', name: 'Crowley', county: 'tarrant', indexed: false, zipCodes: ['76036'] },
  { slug: 'haslet', name: 'Haslet', county: 'tarrant', indexed: false, zipCodes: ['76052'] },
  { slug: 'kennedale', name: 'Kennedale', county: 'tarrant', indexed: false, zipCodes: ['76060'] },

  // --- Dallas County (2026-09-21, not indexed yet) ---
  { slug: 'irving', name: 'Irving', county: 'dallas', indexed: false, zipCodes: ['75038', '75039', '75060', '75061', '75062', '75063'] },
  { slug: 'grand-prairie', name: 'Grand Prairie', county: 'dallas', indexed: false, zipCodes: ['75050', '75051', '75052', '75054'] },
  { slug: 'dallas', name: 'Dallas', county: 'dallas', indexed: false, zipCodes: ['75211', '75212', '75236'] },
  { slug: 'coppell', name: 'Coppell', county: 'dallas', indexed: false, zipCodes: ['75019', '75099'] },
  { slug: 'carrollton', name: 'Carrollton', county: 'dallas', indexed: false, zipCodes: ['75006'] },
  { slug: 'farmers-branch', name: 'Farmers Branch', county: 'dallas', indexed: false, zipCodes: ['75234'] },

  // --- Denton County (2026-09-21, not indexed yet) ---
  { slug: 'lewisville', name: 'Lewisville', county: 'denton', indexed: false, zipCodes: ['75057', '75067', '75077'] },
  { slug: 'flower-mound', name: 'Flower Mound', county: 'denton', indexed: false, zipCodes: ['75022', '75028'] },
  { slug: 'justin', name: 'Justin', county: 'denton', indexed: false, zipCodes: ['76247'] },
  { slug: 'roanoke', name: 'Roanoke', county: 'denton', indexed: false, zipCodes: ['76262'] },
  { slug: 'argyle', name: 'Argyle', county: 'denton', indexed: false, zipCodes: ['76226'] },

  // --- Johnson County (2026-09-21, not indexed yet) ---
  { slug: 'burleson', name: 'Burleson', county: 'johnson', indexed: false, zipCodes: ['76028'] },

  // --- Harris County, Houston market (2026-09-21, not indexed yet) ---
  // Mirrors the Houston campaign's 96 ZIPs (expanded 2026-11-18 from 27). From the
  // client's 181-ZIP list, 83 PO-box codes without a geo target constant and three
  // REMOVAL_PLANNED codes (77046, 77266, 77501) are left out.
  // 77005 stays Houston: West University Place holds only 51% of it.
  // Suburbs added 2026-11-18 have no page of their own and share the Houston page
  // (the middleware sends their visitors here): Pasadena 77502-77506, South Houston
  // 77587, Deer Park 77536, La Porte 77571, Galena Park 77547, Channelview 77530,
  // Baytown 77520 77521 77523, Highlands 77562, Crosby 77532, Huffman 77336,
  // Humble and Kingwood 77338 77339 77345 77346 77396, Porter 77365.
  { slug: 'houston', name: 'Houston', county: 'harris', indexed: false, zipCodes: ['77002', '77003', '77004', '77005', '77006', '77007', '77008', '77009', '77010', '77011', '77012', '77013', '77015', '77016', '77017', '77018', '77019', '77020', '77021', '77022', '77023', '77024', '77025', '77026', '77027', '77028', '77029', '77030', '77031', '77032', '77033', '77035', '77036', '77037', '77038', '77039', '77040', '77042', '77043', '77044', '77045', '77047', '77048', '77049', '77050', '77051', '77054', '77055', '77056', '77057', '77060', '77061', '77063', '77067', '77071', '77073', '77074', '77075', '77076', '77078', '77080', '77081', '77085', '77086', '77087', '77088', '77091', '77092', '77093', '77096', '77098', '77201', '77204', '77336', '77338', '77339', '77345', '77346', '77365', '77396', '77502', '77503', '77504', '77505', '77506', '77520', '77521', '77523', '77530', '77532', '77536', '77547', '77562', '77571', '77587'] },
  { slug: 'bellaire', name: 'Bellaire', county: 'harris', indexed: false, zipCodes: ['77401'] },
];

export function getCitiesByCounty(county: string): City[] {
  return cities.filter(city => city.county === county);
}

export function getCityBySlug(slug: string): City | undefined {
  return cities.find(city => city.slug === slug);
}

export function getTotalCitiesCount(): number {
  return cities.length;
}

/** Cities eligible for search indexing - the only ones that belong in a sitemap. */
export function getIndexedCities(): City[] {
  return cities.filter(city => city.indexed === true);
}

export function isCityIndexed(slug: string): boolean {
  return cities.find(city => city.slug === slug)?.indexed === true;
}
