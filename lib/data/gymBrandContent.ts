/**
 * Templated copy for /gym/brands/<brand> and /gym/brands/<brand>/<equipment>-repair.
 * All of these pages are noindex,follow: they exist for ads and internal links.
 * Same copy rules as the rest of /gym: no prices, no track-record, licensing,
 * factory training or parts-origin claims, no superlatives, no em dashes.
 */

import { gymServices, type GymFaq, type GymProblem, type GymService } from './gymServices';
import { getEquipmentForBrand, gymBrandNotes, gymBrandModels, type GymBrand } from './gymBrands';

const AREA_LIST =
  'Fort Worth, Arlington, Keller, Southlake, Hurst, Euless, Bedford, Irving, Grand Prairie and the rest of the Dallas-Fort Worth area, plus Houston and Bellaire';

const article = (word: string) => (/^[aeiou]/i.test(word) ? 'An' : 'A');

const plural = (service: GymService) => `${service.label.toLowerCase()}s`;

const joinList = (items: string[]): string =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

export const independentLine = (brand: GymBrand) =>
  `H-Prime is an independent repair service, not affiliated with ${brand.name}.`;

export function servicesForBrand(brandSlug: string): GymService[] {
  const slugs = getEquipmentForBrand(brandSlug);
  return gymServices.filter((s) => slugs.includes(s.slug));
}

/* ---------- /gym/brands/<brand> ---------- */

export function brandPageCopy(brand: GymBrand) {
  const services = servicesForBrand(brand.slug);
  const kinds = joinList(services.map(plural));
  const notes = gymBrandNotes[brand.slug] ?? [];

  // Brand-specific notes first, then the two most common problems per equipment type.
  const problems: (GymProblem & { equipment: string })[] = [
    ...notes.map((n) => ({ title: n.title, text: n.text, equipment: n.equipment })),
    ...services.flatMap((s) =>
      s.problems.slice(0, 2).map((p) => ({ title: `${s.label}: ${p.title.charAt(0).toLowerCase()}${p.title.slice(1)}`, text: p.text, equipment: s.slug }))
    ),
  ];

  const faqs: GymFaq[] = [
    {
      q: `Are you ${brand.name} authorized service?`,
      a: `No. ${independentLine(brand)} If your ${brand.name} machine is still inside the manufacturer's labor warranty, contact ${brand.name} first. Out of warranty or bought second-hand, that is the work we do.`,
    },
    {
      q: `How much does ${brand.name} repair cost?`,
      a: 'It depends on the machine and what failed. The technician diagnoses it on site and gives you an upfront quote before any work starts, and you decide whether to go ahead.',
    },
    {
      q: `Which ${brand.name} machines do you repair?`,
      a: `${brand.name} ${kinds}, home and commercial models. Send us the model number when you book and we will confirm before the visit.`,
    },
    {
      q: 'Do you come to me?',
      a: `Yes. All service is on site, at your home or facility, across ${AREA_LIST}.`,
    },
  ];

  return {
    title: `${brand.name} Repair in Dallas-Fort Worth & Houston | H-Prime`,
    description: `Independent ${brand.name} repair for ${kinds} at your home or facility in Dallas-Fort Worth and Houston. Upfront quote before any work starts.`,
    h1: `${brand.name} Repair in Dallas-Fort Worth & Houston`,
    subtitle: `${brand.name} ${kinds} repaired at your home, garage gym or fitness room.`,
    intro: [
      `When ${article(brand.name).toLowerCase()} ${brand.name} machine stops working the way it should, the cause is usually one worn or failed part rather than the whole machine. We come to you, find the fault on site and explain what it takes to fix it.`,
      `H-Prime repairs ${brand.name} ${kinds} across Dallas-Fort Worth and Houston. Every visit starts with a diagnosis and an upfront quote before any work starts.`,
    ],
    services,
    problems,
    models: gymBrandModels[brand.slug] ?? [],
    faqs,
  };
}

/* ---------- /gym/brands/<brand>/<equipment>-repair ---------- */

export function brandEquipmentCopy(brand: GymBrand, service: GymService) {
  const what = `${brand.name} ${service.label.toLowerCase()}`;
  const notes = (gymBrandNotes[brand.slug] ?? []).filter((n) => n.equipment === service.slug);

  const faqs: GymFaq[] = [
    {
      q: `Can you repair my ${what} at home?`,
      a: `Yes. We come to your home, garage gym or building fitness room anywhere in Dallas-Fort Worth or Houston, so there is no need to move the machine.`,
    },
    {
      q: `How much does ${what} repair cost?`,
      a: 'The technician diagnoses the machine first and gives you an upfront quote before any work starts. Nothing is done until you agree.',
    },
    {
      q: 'What should I have ready when I book?',
      a: `The model and serial number from the label on the frame of your ${what}, any message on the console, and a short description of what it is doing. A photo of the label is enough.`,
    },
    {
      q: `My ${what} may still be under warranty. Should I call you?`,
      a: `Check your manual first. Warranty labor is handled by ${brand.name}. ${independentLine(brand)} Once the warranty has run out, or on a machine bought used, book a visit with us.`,
    },
  ];

  return {
    title: `${brand.name} ${service.label} Repair in DFW & Houston | H-Prime`,
    description: `${brand.name} ${service.label.toLowerCase()} repair at your home or facility in Dallas-Fort Worth and Houston: ${service.problems
      .slice(0, 3)
      .map((p) => p.title.toLowerCase())
      .join(', ')}. Upfront quote before any work starts.`,
    h1: `${brand.name} ${service.label} Repair in Dallas-Fort Worth & Houston`,
    subtitle: `On-site repair for ${brand.name} ${plural(service)}, home and commercial.`,
    intro: [
      `${article(brand.name)} ${what} that has started to act up is usually telling you which part is wearing. We diagnose it where it sits, explain the cause in plain terms and give you an upfront quote before any work starts.`,
      `We repair ${brand.name} ${plural(service)} in homes and fitness rooms across Dallas-Fort Worth and Houston. If a part has to be ordered for your exact model, we tell you on the visit and book the return.`,
    ],
    notes,
    faqs,
  };
}
