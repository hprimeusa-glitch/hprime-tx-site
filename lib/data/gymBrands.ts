// Gym equipment brands shown as logos in the /gym section.
// Logos copied from hprime-gym-site/public/brands into public/gym/brands
// (concept2 converted from AVIF to PNG). Plain names are never shown on their own.

export interface GymBrand {
  slug: string;
  name: string;
  logo: string;
}

export const gymBrands: GymBrand[] = [
  { slug: 'life-fitness', name: 'Life Fitness', logo: '/gym/brands/life-fitness.jpg' },
  { slug: 'precor', name: 'Precor', logo: '/gym/brands/precor.png' },
  { slug: 'nordictrack', name: 'NordicTrack', logo: '/gym/brands/nordictrack.png' },
  { slug: 'peloton', name: 'Peloton', logo: '/gym/brands/peloton.png' },
  { slug: 'matrix', name: 'Matrix', logo: '/gym/brands/matrix.jpg' },
  { slug: 'technogym', name: 'Technogym', logo: '/gym/brands/technogym.png' },
  { slug: 'sole', name: 'Sole', logo: '/gym/brands/sole.webp' },
  { slug: 'horizon', name: 'Horizon', logo: '/gym/brands/horizon.webp' },
  { slug: 'bowflex', name: 'Bowflex', logo: '/gym/brands/bowflex.png' },
  { slug: 'schwinn', name: 'Schwinn', logo: '/gym/brands/schwinn.png' },
  { slug: 'nautilus', name: 'Nautilus', logo: '/gym/brands/nautilus.jpg' },
  { slug: 'proform', name: 'ProForm', logo: '/gym/brands/proform.png' },
  { slug: 'stairmaster', name: 'StairMaster', logo: '/gym/brands/stairmaster.webp' },
  { slug: 'concept2', name: 'Concept2', logo: '/gym/brands/concept2.png' },
  { slug: 'keiser', name: 'Keiser', logo: '/gym/brands/keiser.png' },
  { slug: 'true-fitness', name: 'TRUE Fitness', logo: '/gym/brands/true-fitness.png' },
  { slug: 'spirit', name: 'Spirit Fitness', logo: '/gym/brands/spirit.png' },
  { slug: 'star-trac', name: 'Star Trac', logo: '/gym/brands/star-trac.png' },
  { slug: 'hammer-strength', name: 'Hammer Strength', logo: '/gym/brands/hammer-strength.png' },
  { slug: 'body-solid', name: 'Body-Solid', logo: '/gym/brands/body-solid.webp' },
];

export const getGymBrands = (slugs?: string[]): GymBrand[] =>
  slugs ? slugs.map((s) => gymBrands.find((b) => b.slug === s)).filter((b): b is GymBrand => Boolean(b)) : gymBrands;
