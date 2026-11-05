import Image from 'next/image';
import { Building2, Hotel, Home, Briefcase, Wrench, Dumbbell, AlertTriangle } from 'lucide-react';
import GymHero from '@/components/gym/GymHero';
import GymBrandsGrid from '@/components/gym/GymBrandsGrid';
import GymProcess from '@/components/gym/GymProcess';
import GymFaq from '@/components/gym/GymFaq';
import GymFinalCTA from '@/components/gym/GymFinalCTA';
import JsonLd from '@/components/gym/JsonLd';
import { getGymBrands } from '@/lib/data/gymBrands';
import {
  GYM_AREA,
  commercialGymIntro,
  commercialGymClients,
  commercialGymEquipment,
  commercialGymMaintenance,
  commercialGymDownSteps,
  commercialGymFaqs,
} from '@/lib/data/gymContent';
import { gymMetadata, gymServiceSchema, gymFaqSchema, gymBreadcrumbSchema } from '@/lib/seo/gymSeo';

const TITLE = 'Commercial Gym Equipment Repair in DFW | H-Prime';
const DESCRIPTION =
  'Commercial gym equipment repair and preventive maintenance for gyms, hotels, apartments and offices in Dallas-Fort Worth. Cardio and strength. Upfront quotes.';

export const metadata = gymMetadata({ path: '/gym/commercial', title: TITLE, description: DESCRIPTION, indexable: true });

const CLIENT_ICONS = [Dumbbell, Hotel, Home, Briefcase];

const COMMERCIAL_BRANDS = [
  'life-fitness', 'hammer-strength', 'precor', 'matrix', 'technogym', 'stairmaster',
  'star-trac', 'true-fitness', 'keiser', 'concept2', 'body-solid', 'nautilus', 'schwinn',
];

export default function CommercialGymPage() {
  return (
    <>
      <JsonLd
        data={gymServiceSchema({
          path: '/gym/commercial',
          name: 'Commercial Gym Equipment Repair',
          serviceType: 'Commercial fitness equipment repair and maintenance',
          description: DESCRIPTION,
        })}
      />
      <JsonLd data={gymFaqSchema(commercialGymFaqs)} />
      <JsonLd
        data={gymBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Gym Equipment Repair', path: '/gym' },
          { name: 'Commercial', path: '/gym/commercial' },
        ])}
      />

      <GymHero
        eyebrow={`Commercial fitness equipment · ${GYM_AREA}`}
        title="Commercial Gym Equipment Repair in Dallas-Fort Worth"
        subtitle="For gyms, hotels, apartment communities and offices. Cardio and strength, repairs and preventive maintenance."
        image="/gym/equipment/commercial-treadmill.webp"
        imageAlt="Commercial treadmill in a fitness center"
        trackingLabel="gym_commercial_hero"
      />

      <div className="w-full py-4 text-white" style={{ backgroundColor: '#162240' }}>
        <div className="container mx-auto flex items-center justify-center gap-2 px-4 text-center font-semibold">
          <AlertTriangle className="h-5 w-5 shrink-0" style={{ color: '#FFC704' }} aria-hidden="true" />
          <span>Machine down on the floor? Take it out of use and call us.</span>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto max-w-3xl space-y-4 px-4 text-base leading-relaxed text-gray-700 md:text-lg">
          {commercialGymIntro.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900 md:text-4xl">Who we work with</h2>
          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {commercialGymClients.map((client, i) => {
              const Icon = CLIENT_ICONS[i] ?? Building2;
              return (
                <div key={client.title} className="rounded-lg bg-gray-50 p-6 text-center shadow-sm">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: '#FFF8E0' }}>
                    <Icon className="h-7 w-7" style={{ color: '#1B2A4A' }} aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900">{client.title}</h3>
                  <p className="text-gray-600">{client.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900 md:text-4xl">Cardio and strength equipment</h2>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            {([
              ['Cardio', commercialGymEquipment.cardio, '/gym/equipment/commercial-treadmill.webp', 'Commercial treadmill'],
              ['Strength', commercialGymEquipment.strength, '/gym/equipment/commercial-strength.webp', 'Commercial plate-loaded strength machine'],
            ] as const).map(([title, items, img, alt]) => (
              <div key={title} className="overflow-hidden rounded-lg bg-white shadow-md">
                <div className="relative aspect-[16/9] w-full">
                  <Image src={img} alt={alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="mb-3 text-xl font-bold text-gray-900">{title}</h3>
                  <ul className="space-y-1.5">
                    {items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-gray-700">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: '#FFC704' }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="mb-4 flex items-center gap-3">
            <Wrench className="h-7 w-7 shrink-0" style={{ color: '#1B2A4A' }} aria-hidden="true" />
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">{commercialGymMaintenance.heading}</h2>
          </div>
          <div className="mb-6 space-y-4 text-gray-700 md:text-lg">
            {commercialGymMaintenance.paragraphs.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
          <ul className="space-y-2">
            {commercialGymMaintenance.tasks.map((task) => (
              <li key={task} className="flex items-start gap-2 text-gray-700">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: '#FFC704' }} />
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-14 bg-gray-50">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">When a machine goes down</h2>
          <ol className="space-y-3">
            {commercialGymDownSteps.map((step, i) => (
              <li key={step} className="flex items-start gap-3 text-gray-700">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: '#1B2A4A' }}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <GymBrandsGrid
        brands={getGymBrands(COMMERCIAL_BRANDS)}
        heading="Commercial brands we work on"
        hrefFor={(brand) => `/gym/brands/${brand.slug}`}
        footerLink={{ href: '/gym/brands', label: 'All brands we repair →' }}
      />

      <GymProcess />

      <GymFaq faqs={commercialGymFaqs} heading="Commercial gym equipment: common questions" />

      <GymFinalCTA
        heading="Get your fitness room back in service"
        text="Call or book online for a repair or a maintenance visit anywhere in Dallas-Fort Worth. Upfront quote before any work starts."
        trackingLabel="gym_commercial_final_cta"
      />
    </>
  );
}
