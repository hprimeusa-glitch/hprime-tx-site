/**
 * Copy for the /gym hub and /gym/commercial on the Texas site.
 * Same rules as lib/data/gymServices.ts: the only price is the $99 service call, no track-record or licensing
 * claims, no superlatives, Dallas-Fort Worth only.
 */

import type { GymFaq } from './gymServices';

export const GYM_AREA = 'Dallas-Fort Worth';

export const gymTrustPoints = [
  '$99 service call',
  'Upfront quote before any work starts',
  'Home and commercial equipment',
  'We come to you',
];

export const gymProcess = [
  {
    title: 'Tell us about the machine',
    text: 'Book online or call. Brand, model and what it is doing wrong is all we need to start.',
  },
  {
    title: 'Pick a time window',
    text: 'Choose a weekday window that works for you. A technician comes to your home or facility.',
  },
  {
    title: 'Diagnosis and upfront quote',
    text: 'The $99 service call covers the visit and the diagnosis. We find the cause on site and give you a clear quote before any work starts. No surprises on the invoice.',
  },
  {
    title: 'Repair',
    text: 'Once you approve the quote, we get to work. If a part has to be ordered for your model, we tell you and book the return visit.',
  },
];

export const gymHubIntro = [
  'Treadmills, ellipticals, bikes, rowers, stair climbers and strength machines all wear in their own way, and most of them are too heavy to haul anywhere for service. H-Prime brings the repair to you, in homes and garage gyms and in the fitness rooms of apartments, hotels, offices and gyms across Dallas-Fort Worth.',
  'Every visit starts with a diagnosis. You hear what is wrong, what it takes to fix it and an upfront quote before any work starts.',
];

export const gymHubFaqs: GymFaq[] = [
  {
    q: 'What gym equipment do you repair?',
    a: 'Treadmills, ellipticals, spin and exercise bikes, rowing machines, stair climbers, and weight machines and home gyms. Both home and commercial models.',
  },
  {
    q: 'Do you come to my home?',
    a: 'Yes. All service is on site, whether the machine is in a spare room, a garage gym or a building fitness room.',
  },
  {
    q: 'How much does gym equipment repair cost?',
    a: 'The service call is $99 and covers the visit and the diagnosis. The repair itself depends on the machine and the fault, so the technician gives you an upfront quote before any work starts and you decide before anything is done.',
  },
  {
    q: 'Which areas do you serve?',
    a: 'The Dallas-Fort Worth area, including Fort Worth, Arlington, Keller, Southlake, Hurst, Euless, Bedford, Irving and Grand Prairie.',
  },
  {
    q: 'Do you work with gyms, hotels and apartment buildings?',
    a: 'Yes. We repair commercial cardio and strength equipment and offer preventive maintenance visits. See the commercial gym equipment page for details.',
  },
  {
    q: 'What should I have ready when I book?',
    a: 'The brand and model, the serial number from the frame label if you can find it, and a short description of the problem or any message on the console. A photo helps.',
  },
];

/* ---------- /gym/commercial ---------- */

export const commercialGymIntro = [
  'A machine in a shared fitness room works a much longer day than one at home, and when it goes down the problem lands on whoever runs the room: an out-of-order sign, a complaint at the front desk, and a safety question if someone uses it anyway.',
  'H-Prime repairs and maintains commercial cardio and strength equipment on site across Dallas-Fort Worth. We work with property managers, gym owners and facility teams, and give an upfront quote before any work starts.',
];

export const commercialGymClients = [
  { title: 'Gyms and studios', text: 'Cardio floors, cycling rooms and strength areas.' },
  { title: 'Hotels', text: 'Guest fitness rooms that run at all hours, often without staff nearby.' },
  { title: 'Apartments and HOAs', text: 'Resident fitness centers and clubhouses where a fault is usually reported by a resident first.' },
  { title: 'Offices', text: 'Corporate and building fitness centers.' },
];

export const commercialGymEquipment = {
  cardio: ['Treadmills', 'Ellipticals and cross-trainers', 'Indoor cycling and upright bikes', 'Recumbent bikes', 'Rowing machines', 'Stair climbers and stepmills'],
  strength: ['Selectorized machines', 'Cable crossovers and functional trainers', 'Plate-loaded machines', 'Benches and racks', 'Weight stacks, guide rods and pins', 'Cables, pulleys and upholstery'],
};

export const commercialGymMaintenance = {
  heading: 'Preventive maintenance',
  paragraphs: [
    'Most commercial failures are wear that shows up on a schedule: belts and decks on treadmills, drive belts and pivots on ellipticals, cables and pulleys on strength machines. A regular visit catches those before a machine goes out of service.',
    'We set the visit frequency with you based on how many machines you have and how hard they are used. Each visit covers inspection, cleaning and adjustment, and anything that needs a repair is quoted upfront before work starts.',
  ],
  tasks: [
    'Treadmills: belt tracking and tension, deck and belt wear, motor compartment cleaning, roller and drive belt checks, emergency stop test',
    'Ellipticals and bikes: pivots and bearings, drive belts, resistance calibration, hardware torque',
    'Rowers and stair climbers: return mechanisms, rollers, chains and steps',
    'Strength machines: cable and pulley inspection, guide rods, pins, upholstery',
    'Power cords, outlets and console error logs on every machine',
  ],
};

export const commercialGymDownSteps = [
  'Take the machine out of use. On a treadmill, remove the safety key so it cannot be started.',
  'Unplug it or switch it off at the machine.',
  'Put an out-of-order sign on the console and let the front desk or building manager know.',
  'Note the brand, model, serial number and any error message, then book a visit or call us.',
];

export const commercialGymFaqs: GymFaq[] = [
  {
    q: 'Do you offer preventive maintenance for commercial gym equipment?',
    a: 'Yes. We set up regular visits for gyms, hotels, apartment communities and offices, with the frequency based on how many machines you run and how heavily they are used.',
  },
  {
    q: 'Can you service several machines in one visit?',
    a: 'Yes. Send us a list of the machines and what is wrong with each, and we plan the visit around it.',
  },
  {
    q: 'Do you repair strength equipment as well as cardio?',
    a: 'Yes. Cables, pulleys, weight stacks, guide rods, pins, adjustment hardware and upholstery on selectorized and plate-loaded machines.',
  },
  {
    q: 'How is commercial work priced?',
    a: 'The service call is $99 and covers the visit and the diagnosis. Every repair is quoted upfront before any work starts. For maintenance visits we agree the scope with you in advance.',
  },
  {
    q: 'Which brands do you work on?',
    a: 'Commercial lines including Life Fitness, Hammer Strength, Precor, Matrix, Technogym, StairMaster, Star Trac, TRUE, Keiser and Concept2, plus home brands found in apartment and hotel fitness rooms.',
  },
];
