/**
 * Gym equipment service pages for the Texas site (/gym/<slug>).
 *
 * Adapted from the hprime-gym.com site (hprime-gym-site lib/data/appliances.ts and
 * serviceContent.ts) and rewritten for Dallas-Fort Worth and Houston. No paragraph
 * is copied from hprime-gym.com, to keep the two sites from duplicating each other.
 *
 * Copy rules for this section: no prices or fee amounts (an upfront quote before
 * any work starts), no years in business, review counts, licensing, factory
 * training or parts-origin claims, no superlatives, no out-of-state locations.
 *
 * Indexing: only pages with `indexable: true` go into sitemap-phase1 and render
 * index,follow. The rest serve ads and internal links under noindex,follow until
 * they are released.
 */

export interface GymProblem {
  title: string;
  text: string;
}

export interface GymFaq {
  q: string;
  a: string;
}

export interface GymService {
  slug: string;
  /** route segment under /gym */
  path: string;
  /** equipment name as it reads in a sentence ("treadmill") */
  name: string;
  /** card title ("Treadmill Repair") */
  cardTitle: string;
  cardText: string;
  image: string;
  imageAlt: string;
  indexable: boolean;
  /** <title> */
  title: string;
  /** meta description */
  description: string;
  h1: string;
  subtitle: string;
  intro: string[];
  problemsHeading: string;
  problems: GymProblem[];
  checksHeading: string;
  checks: string[];
  brandSlugs: string[];
  faqs: GymFaq[];
}

export const gymServices: GymService[] = [
  {
    slug: 'treadmill',
    path: 'treadmill-repair',
    name: 'treadmill',
    cardTitle: 'Treadmill Repair',
    cardText: 'Slipping or drifting belts, motor and drive faults, incline that will not move, dead consoles and error codes.',
    image: '/gym/equipment/treadmill.webp',
    imageAlt: 'Commercial treadmill on a gym floor',
    indexable: true,
    title: 'Treadmill Repair in Dallas-Fort Worth & Houston | H-Prime',
    description:
      'In-home and on-site treadmill repair across Dallas-Fort Worth and Houston: belt slipping, motor and controller faults, incline, consoles. Upfront quote before any work starts.',
    h1: 'Treadmill Repair in Dallas-Fort Worth & Houston',
    subtitle: 'Belts and decks, motors and controllers, incline, consoles. Home and commercial treadmills.',
    intro: [
      'Most treadmills give a warning before they quit. The belt catches for a split second under your stride, the deck gets louder, the console resets in the middle of a workout, or the incline stops answering the button. Catching it at that stage usually means a smaller repair than waiting until the machine refuses to start.',
      'H-Prime sends a technician to your home, garage gym or building fitness room in the Dallas-Fort Worth area and in Houston. We find the cause on site, explain it in plain terms and give you an upfront quote before any work starts. If a part has to be ordered for your exact model, we tell you that on the visit.',
    ],
    problemsHeading: 'Treadmill problems we fix',
    problems: [
      {
        title: 'Belt slipping or hesitating',
        text: 'Usually running-belt tension first. If the belt still slips once it is tensioned correctly, the drive belt under the motor cover is the next suspect, not the running belt.',
      },
      {
        title: 'Belt drifting to one side',
        text: 'Tracking is adjusted in small steps with the belt moving at walking speed. An unlevel floor or a stride that favors one leg can pull a belt off center as easily as a worn roller.',
      },
      {
        title: 'Tripped breaker or belt stopping under load',
        text: 'High friction between a worn belt and deck makes the motor draw more current than it should. Left alone, this is the failure that ends with a new deck and belt.',
      },
      {
        title: 'Motor or controller faults',
        text: 'Speed that surges or drops, a burning smell, or an over-current code. We test the motor, the controller board and the supply before replacing anything.',
      },
      {
        title: 'Incline not moving',
        text: 'Elevation motors, their wiring and the position sensor that tells the console where the deck sits. A stuck incline is often a sensor or cable, not the motor itself.',
      },
      {
        title: 'Console dead or resetting',
        text: 'Check the treadmill\'s own circuit breaker on the frame first. Resets when you touch the console can come from poor grounding and static rather than a failed board.',
      },
      {
        title: 'Error codes',
        text: 'Brands such as Sole, Life Fitness, Precor and Landice publish their codes, and the code narrows the job fast. NordicTrack and ProForm machines describe faults by symptom instead, so we diagnose those from what the machine does.',
      },
      {
        title: 'Noise, thumping and vibration',
        text: 'Rollers, bearings, a dry or worn deck, loose frame hardware, or an over-tightened belt groaning under load.',
      },
    ],
    checksHeading: 'Worth checking before you book',
    checks: [
      'Reset the circuit breaker on the treadmill frame, usually near the power switch. A completely dark console is often just that.',
      'Plug the treadmill into its own wall outlet, not an extension cord or a shared power strip. Low supply voltage causes speed and console faults.',
      'Look up how your model is lubricated before adding anything. Some decks want silicone on a schedule, others say never apply lubricant unless the manual tells you to, and waxed decks must not be treated at all.',
      'Write down the brand, model and serial number from the frame label and any message on the console. A photo is enough.',
    ],
    brandSlugs: ['life-fitness', 'precor', 'nordictrack', 'proform', 'sole', 'horizon', 'peloton', 'matrix', 'true-fitness', 'spirit', 'bowflex', 'star-trac'],
    faqs: [
      {
        q: 'Do you repair treadmills at home or do I need to bring it in?',
        a: 'We come to you. Treadmills are heavy and awkward to move, so the diagnosis and the repair happen where the machine sits: a spare room, a garage gym, or a fitness room in an apartment or office building.',
      },
      {
        q: 'How much does treadmill repair cost?',
        a: 'It depends on the cause, and a tensioning job and a motor controller are very different repairs. The technician diagnoses the treadmill first and gives you an upfront quote before any work starts. You decide whether to go ahead.',
      },
      {
        q: 'Is it worth repairing an older treadmill?',
        a: 'Often yes. The frame and motor on a decent treadmill outlast the wear parts around them: the belt, the deck, rollers and the drive belt. If a repair would not make sense for your machine, we will say so on the visit.',
      },
      {
        q: 'Which treadmill brands do you work on?',
        a: 'Home and commercial machines, including NordicTrack, ProForm, Sole, Horizon, Life Fitness, Precor, Matrix, Peloton, TRUE, Spirit and Bowflex. Send us the model number and we will confirm before the visit.',
      },
      {
        q: 'What areas do you cover for treadmill repair?',
        a: 'The Dallas-Fort Worth area, including Fort Worth, Arlington, Keller, Southlake, Hurst, Euless, Bedford, Irving and Grand Prairie, and Houston including Bellaire.',
      },
    ],
  },
  {
    slug: 'elliptical',
    path: 'elliptical-repair',
    name: 'elliptical',
    cardTitle: 'Elliptical Repair',
    cardText: 'Squeaks and clicks, resistance that will not change, worn pivots and pedals, incline ramps and consoles.',
    image: '/gym/equipment/elliptical.webp',
    imageAlt: 'Elliptical cross-trainer in a fitness room',
    indexable: false,
    title: 'Elliptical Repair in Dallas-Fort Worth & Houston | H-Prime',
    description:
      'Elliptical repair at your home or facility in Dallas-Fort Worth and Houston: noise, resistance, pedals, incline and consoles. Upfront quote before any work starts.',
    h1: 'Elliptical Repair in Dallas-Fort Worth & Houston',
    subtitle: 'Noise, resistance, pedals and pivots, incline ramps, consoles.',
    intro: [
      'An elliptical has more moving joints than most cardio machines, and each one can start to squeak, click or wobble as it wears. Resistance problems are the other common call: the level changes on the screen but the stride feels the same.',
      'We repair home and commercial ellipticals across Dallas-Fort Worth and Houston on site. You get the diagnosis and an upfront quote before any work starts.',
    ],
    problemsHeading: 'Elliptical problems we fix',
    problems: [
      { title: 'Squeaking, clicking or grinding', text: 'Pivot bushings, rocker arm shafts, pedal bearings and loose hardware. We find which joint it is instead of spraying everything.' },
      { title: 'Resistance not changing', text: 'Brake magnet, resistance motor, cable or the sensor that reports the level back to the console.' },
      { title: 'Pedals or crank loose', text: 'Worn crank bearings, stripped threads and pedal arms that have started to play.' },
      { title: 'Incline ramp stuck', text: 'Ramp motors, their drive and position sensing on machines with adjustable incline.' },
      { title: 'Console blank or reading wrong', text: 'Power supply, wiring between the base and the console, and speed sensors.' },
      { title: 'Drive belt slipping', text: 'A worn or loose drive belt makes the stride feel uneven or jerky under load.' },
    ],
    checksHeading: 'Worth checking before you book',
    checks: [
      'Confirm the power adapter is seated at both ends and the outlet works.',
      'Note which part of the stride the noise happens in, and whether it changes with resistance level.',
      'Take a photo of the serial label, usually on the frame near the front stabilizer.',
    ],
    brandSlugs: ['life-fitness', 'precor', 'nordictrack', 'sole', 'horizon', 'matrix', 'bowflex', 'schwinn', 'nautilus', 'proform'],
    faqs: [
      { q: 'Can you fix an elliptical that squeaks no matter what I do?', a: 'Usually. Persistent squeaks come from a worn bushing or bearing in one of the pivots, and spraying lubricant on the outside rarely reaches it. We locate the joint and replace or service the worn part.' },
      { q: 'How is the price set?', a: 'The technician diagnoses the machine first and gives you an upfront quote before any work starts.' },
      { q: 'Do you repair commercial ellipticals too?', a: 'Yes. We work on home machines and on commercial ellipticals in gyms, hotels, apartment fitness rooms and offices.' },
    ],
  },
  {
    slug: 'spin-bike',
    path: 'spin-bike-repair',
    name: 'spin bike',
    cardTitle: 'Spin & Exercise Bike Repair',
    cardText: 'Resistance that will not engage, flywheel noise, chains and belts, pedals, cranks, screens and consoles.',
    image: '/gym/equipment/spin-bike.webp',
    imageAlt: 'Indoor cycling bike on a gym floor',
    indexable: false,
    title: 'Spin & Exercise Bike Repair in DFW & Houston | H-Prime',
    description:
      'Spin, upright and recumbent bike repair in Dallas-Fort Worth and Houston: resistance, flywheel noise, pedals, cranks and consoles. Upfront quote before any work starts.',
    h1: 'Spin & Exercise Bike Repair in Dallas-Fort Worth & Houston',
    subtitle: 'Indoor cycling, upright and recumbent bikes. Home and studio.',
    intro: [
      'Indoor bikes are simple machines that get ridden hard. When resistance stops engaging, the flywheel starts to knock or a pedal begins to click on every turn, the cause is usually one worn part rather than the whole bike.',
      'We repair connected bikes, studio cycling bikes and upright and recumbent exercise bikes in homes and fitness rooms across Dallas-Fort Worth and Houston, with an upfront quote before any work starts.',
    ],
    problemsHeading: 'Bike problems we fix',
    problems: [
      { title: 'Resistance not engaging', text: 'Brake pads, magnetic brake position, the resistance knob mechanism or the motor on bikes with electronic resistance.' },
      { title: 'Flywheel noise or wobble', text: 'Hub bearings, flywheel alignment and loose mounting hardware.' },
      { title: 'Clicking pedals or cranks', text: 'Pedal threads, crank arms and bottom bracket bearings.' },
      { title: 'Chain or belt problems', text: 'Stretched chains, worn drive belts and tension that has drifted out of adjustment.' },
      { title: 'Screen or console faults', text: 'Power, cables between the frame and the screen, and cadence and resistance sensors.' },
      { title: 'Seat and handlebar adjustments slipping', text: 'Pop pins, clamps and sliders that no longer hold their position.' },
    ],
    checksHeading: 'Worth checking before you book',
    checks: [
      'For connected bikes, restart the screen and check the cable at the back of it before assuming a hardware fault.',
      'Check that the pedals are tight in the crank arms. A loose pedal clicks on every stroke.',
      'Note the model and serial number from the frame label.',
    ],
    brandSlugs: ['peloton', 'keiser', 'schwinn', 'bowflex', 'nordictrack', 'life-fitness', 'matrix', 'star-trac'],
    faqs: [
      { q: 'Do you work on connected bikes like Peloton?', a: 'Yes, we repair the mechanical and electrical side of connected bikes: resistance, flywheel, pedals, cranks, cables and power. Subscription and app problems are handled by the manufacturer.' },
      { q: 'Can you service a full cycling studio?', a: 'Yes. For studios and gyms we can work through several bikes in one visit. See our commercial gym equipment page for preventive maintenance.' },
      { q: 'How is the price set?', a: 'We diagnose the bike first and give you an upfront quote before any work starts.' },
    ],
  },
  {
    slug: 'rowing-machine',
    path: 'rowing-machine-repair',
    name: 'rowing machine',
    cardTitle: 'Rowing Machine Repair',
    cardText: 'Handle and strap retraction, seat rail and rollers, resistance, monitors and sensors.',
    image: '/gym/equipment/rowing-machine.webp',
    imageAlt: 'Air rowing machine in a fitness room',
    indexable: false,
    title: 'Rowing Machine Repair in Dallas-Fort Worth & Houston | H-Prime',
    description:
      'Rowing machine repair in Dallas-Fort Worth and Houston: strap and handle return, seat rollers, resistance and monitors. Upfront quote before any work starts.',
    h1: 'Rowing Machine Repair in Dallas-Fort Worth & Houston',
    subtitle: 'Air, water and magnetic rowers. Home and commercial.',
    intro: [
      'A rower that feels rough, a handle that will not return or a monitor that stops counting strokes takes the machine out of a workout fast. Most of these come down to the return mechanism, the seat rollers or a sensor.',
      'We repair rowing machines in homes and fitness facilities across Dallas-Fort Worth and Houston, with an upfront quote before any work starts.',
    ],
    problemsHeading: 'Rower problems we fix',
    problems: [
      { title: 'Handle not returning', text: 'Shock cord or return spring, pulleys and the strap or chain path.' },
      { title: 'Seat sticking or bumping', text: 'Worn seat rollers, debris on the rail and rail alignment.' },
      { title: 'Resistance feels wrong', text: 'Damper and fan housing on air rowers, tank and paddle on water rowers, magnet position on magnetic models.' },
      { title: 'Monitor not counting', text: 'Pickup sensor, cable and monitor power.' },
      { title: 'Noise from the flywheel', text: 'Bearings, fan or flywheel contact and loose housings.' },
    ],
    checksHeading: 'Worth checking before you book',
    checks: [
      'Wipe the seat rail clean and check for debris under the seat.',
      'Replace the monitor batteries if your model uses them.',
      'Note the model and serial number.',
    ],
    brandSlugs: ['concept2', 'life-fitness', 'matrix', 'bowflex', 'nordictrack', 'technogym'],
    faqs: [
      { q: 'Do you repair water rowers?', a: 'Yes, along with air and magnetic rowers. Tell us the model when you book so the technician knows what to expect.' },
      { q: 'How is the price set?', a: 'We diagnose the rower first and give you an upfront quote before any work starts.' },
    ],
  },
  {
    slug: 'stair-machine',
    path: 'stair-machine-repair',
    name: 'stair machine',
    cardTitle: 'Stair Climber Repair',
    cardText: 'Stepmills and steppers: chains and steps, drive motors, speed control, consoles and safety sensors.',
    image: '/gym/equipment/stair-machine.webp',
    imageAlt: 'Stair climber machine in a gym',
    indexable: false,
    title: 'Stair Climber Repair in Dallas-Fort Worth & Houston | H-Prime',
    description:
      'Stair climber and stepper repair in Dallas-Fort Worth and Houston: steps, chains, drive motors, speed control and consoles. Upfront quote before any work starts.',
    h1: 'Stair Climber Repair in Dallas-Fort Worth & Houston',
    subtitle: 'Stepmills, steppers and climbers. Commercial and home.',
    intro: [
      'Stair climbers carry a lot of weight on a short, repeating path, so chains, step axles and drive components wear on a predictable schedule. A step that catches or a machine that will not hold speed should come out of use until it is checked.',
      'We repair stair machines in gyms, fitness rooms and homes across Dallas-Fort Worth and Houston, with an upfront quote before any work starts.',
    ],
    problemsHeading: 'Stair machine problems we fix',
    problems: [
      { title: 'Steps catching or jerking', text: 'Step chain wear, step axles, rollers and tension.' },
      { title: 'Speed not holding', text: 'Drive motor, controller, brake and speed sensor.' },
      { title: 'Machine will not start', text: 'Power, safety sensors and the console.' },
      { title: 'Noise under the steps', text: 'Chain lubrication, bearings and loose step hardware.' },
      { title: 'Pedal steppers losing resistance', text: 'Cylinders, brakes and linkages on independent-pedal steppers.' },
    ],
    checksHeading: 'Worth checking before you book',
    checks: [
      'Take the machine out of use if a step catches or the speed surges.',
      'Note any message on the console and the serial number on the frame.',
    ],
    brandSlugs: ['stairmaster', 'life-fitness', 'matrix', 'precor', 'bowflex', 'star-trac'],
    faqs: [
      { q: 'Do you repair StairMaster machines?', a: 'Yes, along with stepmills and steppers from Life Fitness, Matrix, Precor and other brands.' },
      { q: 'How is the price set?', a: 'We diagnose the machine first and give you an upfront quote before any work starts.' },
    ],
  },
  {
    slug: 'weight-machine',
    path: 'weight-machine-repair',
    name: 'weight machine',
    cardTitle: 'Weight Machine & Home Gym Repair',
    cardText: 'Frayed cables, pulleys, weight stack guide rods, pins, upholstery and adjustment hardware.',
    image: '/gym/equipment/weight-machine.webp',
    imageAlt: 'Multi-station weight machine in a home gym',
    indexable: false,
    title: 'Weight Machine Repair in Dallas-Fort Worth & Houston | H-Prime',
    description:
      'Weight machine and home gym repair in Dallas-Fort Worth and Houston: cables, pulleys, stacks, guide rods and pins. Upfront quote before any work starts.',
    h1: 'Weight Machine & Home Gym Repair in Dallas-Fort Worth & Houston',
    subtitle: 'Selectorized machines, cable stations and home gyms.',
    intro: [
      'Strength equipment rarely stops working outright. It wears: cables fray, pulleys get noisy, the weight stack drags on its guide rods and pins stop seating cleanly. A frayed cable is a safety problem, not a cosmetic one, and the machine should not be used until it is replaced.',
      'We service and repair weight machines and home gyms across Dallas-Fort Worth and Houston, with an upfront quote before any work starts.',
    ],
    problemsHeading: 'Strength equipment problems we fix',
    problems: [
      { title: 'Frayed or stretched cables', text: 'Cable replacement and routing checks across every pulley on the path.' },
      { title: 'Noisy or worn pulleys', text: 'Pulley bearings and alignment.' },
      { title: 'Weight stack dragging', text: 'Guide rod cleaning and lubrication, stack alignment and bushings.' },
      { title: 'Selector pins not seating', text: 'Bent pins, worn stack holes and selector rods.' },
      { title: 'Adjustments slipping', text: 'Pop pins, seat and pad adjusters and cam hardware.' },
      { title: 'Torn upholstery', text: 'Pads and seats that have split or lost their foam.' },
    ],
    checksHeading: 'Worth checking before you book',
    checks: [
      'Stop using the machine if a cable shows broken strands, kinks or a bulge.',
      'Photograph the cable path and the brand label so we can bring the right cable length.',
    ],
    brandSlugs: ['hammer-strength', 'life-fitness', 'body-solid', 'matrix', 'precor', 'bowflex', 'nautilus', 'technogym'],
    faqs: [
      { q: 'Can you replace cables on any home gym?', a: 'On most of them. Cable length and end fittings vary by model, so send us the brand and model when you book.' },
      { q: 'How is the price set?', a: 'We inspect the machine first and give you an upfront quote before any work starts.' },
    ],
  },
];

export const getGymService = (path: string): GymService | undefined =>
  gymServices.find((s) => s.path === path);

export const GYM_SITE_URL = 'https://tx.h-prime-co.com';
