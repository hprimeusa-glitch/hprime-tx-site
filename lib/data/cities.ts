// Fort Worth Metro Area cities - H-Prime Appliance Repair service area
// Service area: Fort Worth + Mid-Cities (HEB), Tarrant County, TX

export interface City {
  slug: string;
  name: string;
  county: string;
  zipCodes?: string[];
}

export const cities: City[] = [
  // Tarrant County
  { slug: 'fort-worth', name: 'Fort Worth', county: 'tarrant', zipCodes: ['76101', '76102', '76103', '76104', '76106', '76107', '76109', '76110', '76111', '76113', '76114', '76116', '76118', '76121', '76124', '76127', '76129', '76130', '76131', '76136', '76137', '76147', '76148', '76150', '76161', '76162', '76163', '76164', '76166', '76181', '76185', '76190', '76191', '76192', '76193', '76195', '76196', '76197', '76198', '76199'] },
  { slug: 'keller', name: 'Keller', county: 'tarrant', zipCodes: ['76244', '76248'] },
  { slug: 'north-richland-hills', name: 'North Richland Hills', county: 'tarrant', zipCodes: ['76180', '76182'] },
  { slug: 'haltom-city', name: 'Haltom City', county: 'tarrant', zipCodes: ['76117'] },
  { slug: 'hurst', name: 'Hurst', county: 'tarrant', zipCodes: ['76053', '76054'] },
  { slug: 'euless', name: 'Euless', county: 'tarrant', zipCodes: ['76039', '76040'] },
  { slug: 'bedford', name: 'Bedford', county: 'tarrant', zipCodes: ['76021', '76022', '76095'] },
  { slug: 'colleyville', name: 'Colleyville', county: 'tarrant', zipCodes: ['76034'] },
  { slug: 'southlake', name: 'Southlake', county: 'tarrant', zipCodes: ['76092'] },
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
