/**
 * Gym equipment brands for the /gym section: logo grid, /gym/brands index,
 * /gym/brands/<brand> and /gym/brands/<brand>/<equipment>-repair pages.
 *
 * Logos come from hprime-gym-site/public/brands, trimmed into public/gym/brands.
 * A brand without `logo` renders a text tile. Cybex has no logo on purpose: the
 * file in the gym repo is the logo of the stroller company of the same name.
 *
 * Brand to equipment mapping: hprime-gym-site lib/data/serviceBrands.ts, restricted
 * to the six Texas equipment slugs. The gym repo's `stationary-bike` list is folded
 * into `spin-bike`, because /gym/spin-bike-repair covers spin, upright and recumbent
 * bikes (the gym site 301s its stationary hub to spin-bike for the same reason).
 *
 * Model families and brand notes are limited to what the gym repo's own content
 * (brandContent.ts, serviceContent.ts, scenePhotos.ts) names. No prices, no
 * track-record or authorisation claims.
 */

export interface GymBrand {
  slug: string;
  name: string;
  logo?: string;
}

export interface GymBrandNote {
  /** equipment slug the note applies to */
  equipment: string;
  title: string;
  text: string;
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
  { slug: 'assault-fitness', name: 'Assault Fitness', logo: '/gym/brands/assault-fitness.webp' },
  { slug: 'cybex', name: 'Cybex' },
  { slug: 'landice', name: 'Landice', logo: '/gym/brands/landice.png' },
  { slug: 'hydrow', name: 'Hydrow', logo: '/gym/brands/hydrow.png' },
  { slug: 'waterrower', name: 'WaterRower', logo: '/gym/brands/waterrower.png' },
  { slug: 'echelon', name: 'Echelon', logo: '/gym/brands/echelon.png' },
  { slug: 'octane', name: 'Octane Fitness', logo: '/gym/brands/octane.png' },
];

/** hprime-gym-site serviceBrands.ts, Texas equipment slugs only, stationary-bike folded into spin-bike. */
const SOURCE_MAPPING: Record<string, string[]> = {
  treadmill: ['life-fitness', 'precor', 'nordictrack', 'peloton', 'matrix', 'cybex', 'technogym', 'sole', 'horizon', 'bowflex', 'proform', 'true-fitness', 'spirit', 'landice', 'freemotion', 'star-trac', 'assault-fitness', 'sunny-health', 'xterra', 'ironman'],
  elliptical: ['life-fitness', 'precor', 'nordictrack', 'matrix', 'cybex', 'technogym', 'sole', 'horizon', 'bowflex', 'schwinn', 'proform', 'true-fitness', 'spirit', 'octane', 'freemotion', 'diamondback', 'sunny-health', 'xterra'],
  'spin-bike': [
    // gym repo spin-bike
    'peloton', 'keiser', 'schwinn', 'life-fitness', 'precor', 'matrix', 'technogym', 'echelon', 'nordictrack', 'assault-fitness', 'sunny-health', 'star-trac',
    // gym repo stationary-bike
    'cybex', 'nautilus', 'bowflex', 'proform', 'true-fitness', 'spirit', 'diamondback', 'body-craft',
  ],
  'rowing-machine': ['concept2', 'life-fitness', 'matrix', 'technogym', 'waterrower', 'hydrow', 'nordictrack', 'bowflex', 'spirit', 'true-fitness', 'sunny-health', 'xterra', 'octane'],
  'stair-machine': ['stairmaster', 'life-fitness', 'precor', 'matrix', 'cybex', 'technogym', 'spirit', 'true-fitness', 'nautilus', 'bowflex', 'nordictrack'],
  'weight-machine': ['life-fitness', 'precor', 'matrix', 'cybex', 'technogym', 'hammer-strength', 'body-solid', 'hoist', 'legend-fitness', 'powertec', 'nautilus', 'inspire', 'marcy', 'body-craft', 'rogue', 'titan-fitness', 'freemotion', 'star-trac', 'fitness-gear'],
};

const BRAND_SLUGS = new Set(gymBrands.map((b) => b.slug));

/** equipment slug → brand slugs we publish, in source order */
export const equipmentBrandMap: Record<string, string[]> = Object.fromEntries(
  Object.entries(SOURCE_MAPPING).map(([eq, slugs]) => [eq, slugs.filter((s) => BRAND_SLUGS.has(s))])
);

/** Short model-family list, only where the gym repo names models. */
export const gymBrandModels: Record<string, string[]> = {
  nordictrack: ['Commercial series treadmills', 'X Series incline trainers', 'S22i studio bike', 'AirGlide ellipticals'],
  peloton: ['Peloton Bike', 'Peloton Bike+', 'Peloton Tread'],
  schwinn: ['IC4 and IC3 indoor bikes', '170 upright bike', '270 recumbent bike', '411 elliptical'],
  bowflex: ['Max Trainer', 'VeloCore bike', 'C6 bike'],
  keiser: ['M3i indoor bike'],
  echelon: ['EX3 connected bike'],
  horizon: ['EX-59 elliptical'],
  'life-fitness': ['Integrity series treadmills', 'PowerMill stair climber'],
  stairmaster: ['Gauntlet stepmill'],
};

/** Brand-specific notes taken from the gym repo's manufacturer-sourced content. */
export const gymBrandNotes: Record<string, GymBrandNote[]> = {
  nordictrack: [
    { equipment: 'treadmill', title: 'No numeric error codes', text: 'NordicTrack manuals are written as symptom tables, so a number quoted on a forum has no manufacturer meaning. We diagnose from what the machine does.' },
    { equipment: 'treadmill', title: 'Belt lubrication', text: 'The walking belt ships pre-lubricated, and the manual says not to apply silicone or anything else unless a service representative asks you to. A dry or fraying belt is a service call, not a spray can.' },
    { equipment: 'spin-bike', title: 'Frozen or dark console', text: 'A console that freezes or loses Wi-Fi is often software. A console reset or firmware update comes first; if the screen stays dark with power on, that is when a technician is worth the trip.' },
  ],
  proform: [
    { equipment: 'treadmill', title: 'No numeric error codes', text: 'ProForm manuals describe faults by symptom rather than code, so we diagnose from what the treadmill is doing.' },
    { equipment: 'treadmill', title: 'Belt lubrication', text: 'Like other iFIT machines, the belt ships pre-lubricated. Do not add silicone unless the manual tells you to.' },
  ],
  sole: [
    { equipment: 'treadmill', title: 'Published error codes', text: 'Sole publishes its codes. E01 is over-current protection, E05 and E06 point at supply voltage, and a console communication fault is first attacked by cutting power for two full minutes.' },
    { equipment: 'treadmill', title: 'Console resets when touched', text: 'Sole links this to poor grounding and static, which is a grounding fix rather than a new console.' },
  ],
  spirit: [
    { equipment: 'treadmill', title: 'Console drops out on dry days', text: 'Spirit attributes this to an ungrounded machine and static discharge, not a failed console.' },
  ],
  'life-fitness': [
    { equipment: 'treadmill', title: 'Unable to reach set speed', text: 'Life Fitness ties this error to a worn deck, debris under the machine, several machines on one circuit, or low voltage. Each treadmill should be on its own branch circuit.' },
    { equipment: 'treadmill', title: 'Thermal shutdown', text: 'A motor controller over-temperature code usually starts with blocked vents and dust, so cleaning comes before parts.' },
  ],
  precor: [
    { equipment: 'treadmill', title: 'Motor current too high', text: 'Precor reads this as a sign of a worn belt and deck. The fix is the belt and deck, not the motor.' },
    { equipment: 'treadmill', title: 'Electronics over-temperature', text: 'Step one in Precor\'s own guidance is a cooling fan clogged with dust.' },
    { equipment: 'treadmill', title: 'No lubricant or wax on the deck', text: 'Precor warns that silicone sprays and wax degrade the deck surface. A well meant spray can shorten the life of the deck.' },
  ],
  landice: [
    { equipment: 'treadmill', title: 'Groaning under load', text: 'Landice names an over-tightened running belt as the usual cause of that sound. Tightening it further makes it worse.' },
    { equipment: 'treadmill', title: 'Error codes', text: 'Landice codes are designed not to be cleared by the owner, so a code that keeps returning needs a technician.' },
  ],
  peloton: [
    { equipment: 'treadmill', title: 'Blinking red light on the Tread', text: 'Peloton publishes no code list for the Tread. The first step is to reseat the safety key, then check belt tracking against the center line.' },
  ],
  horizon: [
    { equipment: 'treadmill', title: 'Know your deck type', text: 'Horizon builds both silicone and waxed decks, and a waxed deck must never be treated with anything. Check before lubricating.' },
  ],
  'true-fitness': [
    { equipment: 'treadmill', title: 'Belt slipping', text: 'TRUE lists three causes: tracking, tension and lubrication. An unlevel floor can also pull the belt off center.' },
  ],
  bowflex: [
    { equipment: 'treadmill', title: 'Word messages, not codes', text: 'Bowflex consoles show words such as a safety key prompt or a lubrication reminder. A reminder is not a failure.' },
  ],
  'hammer-strength': [
    { equipment: 'weight-machine', title: 'Frayed cables', text: 'Hammer Strength treats a frayed cable as a serious liability and calls for replacement at the first sign of wear. Take the machine out of use until it is done.' },
  ],
};

export const getGymBrand = (slug: string): GymBrand | undefined => gymBrands.find((b) => b.slug === slug);

export const getGymBrands = (slugs?: string[]): GymBrand[] =>
  slugs ? slugs.map((s) => getGymBrand(s)).filter((b): b is GymBrand => Boolean(b)) : gymBrands;

/** Equipment slugs a brand has a combo page for. */
export const getEquipmentForBrand = (brandSlug: string): string[] =>
  Object.entries(equipmentBrandMap)
    .filter(([, slugs]) => slugs.includes(brandSlug))
    .map(([eq]) => eq);

export const hasBrandEquipment = (brandSlug: string, equipmentSlug: string): boolean =>
  Boolean(equipmentBrandMap[equipmentSlug]?.includes(brandSlug));

export const getBrandsForEquipment = (equipmentSlug: string): GymBrand[] =>
  getGymBrands(equipmentBrandMap[equipmentSlug] ?? []);

/**
 * Brand-specific product image for a brand + equipment pair, from
 * hprime-gym-site/public/equipment/<brand>/<type>.webp (stationary-bike for
 * spin-bike), resized into public/gym/equipment/brands/<brand>-<equipment>.webp.
 * Pages never show one brand's machine on another brand's page, so a pair without
 * its own image returns undefined and the page renders without a photo.
 */
const NO_BRAND_IMAGE = new Set(['star-trac/spin-bike']);

export const brandEquipmentImage = (brandSlug: string, equipmentSlug: string): string | undefined =>
  hasBrandEquipment(brandSlug, equipmentSlug) && !NO_BRAND_IMAGE.has(`${brandSlug}/${equipmentSlug}`)
    ? `/gym/equipment/brands/${brandSlug}-${equipmentSlug}.webp`
    : undefined;
