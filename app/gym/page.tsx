import GymHero from '@/components/gym/GymHero';
import GymServiceCards from '@/components/gym/GymServiceCards';
import GymBrandsGrid from '@/components/gym/GymBrandsGrid';
import GymProcess from '@/components/gym/GymProcess';
import GymFaq from '@/components/gym/GymFaq';
import GymFinalCTA from '@/components/gym/GymFinalCTA';
import JsonLd from '@/components/gym/JsonLd';
import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { gymServices } from '@/lib/data/gymServices';
import { gymBrands } from '@/lib/data/gymBrands';
import { gymHubIntro, gymHubFaqs } from '@/lib/data/gymContent';
import { gymMetadata, gymServiceSchema, gymFaqSchema, gymBreadcrumbSchema } from '@/lib/seo/gymSeo';

const TITLE = 'Gym Equipment Repair in Dallas-Fort Worth & Houston | H-Prime';
const DESCRIPTION =
  'On-site repair for treadmills, ellipticals, bikes, rowers, stair climbers and weight machines in Dallas-Fort Worth and Houston. Home and commercial. Upfront quote before any work starts.';

export const metadata = gymMetadata({ path: '/gym', title: TITLE, description: DESCRIPTION, indexable: true });

export default function GymHubPage() {
  return (
    <>
      <JsonLd
        data={gymServiceSchema({
          path: '/gym',
          name: 'Gym Equipment Repair',
          serviceType: 'Fitness equipment repair',
          description: DESCRIPTION,
        })}
      />
      <JsonLd data={gymFaqSchema(gymHubFaqs)} />
      <JsonLd data={gymBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Gym Equipment Repair', path: '/gym' }])} />

      <GymHero
        eyebrow="Home and commercial fitness equipment"
        title="Gym Equipment Repair in Dallas-Fort Worth & Houston"
        subtitle="Treadmills, ellipticals, bikes, rowers, stair climbers and strength machines. Repaired at your home or facility."
        image="/gym/equipment/treadmill.webp"
        imageAlt="Treadmill in a gym, one of the machines H-Prime repairs"
        trackingLabel="gym_hero_book_button"
      />

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto max-w-3xl space-y-4 px-4 text-base leading-relaxed text-gray-700 md:text-lg">
          {gymHubIntro.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </div>
      </section>

      <GymServiceCards
        services={gymServices}
        heading="Equipment we repair"
        subheading="Home and commercial machines, cardio and strength."
      />

      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <Link
            href="/gym/commercial"
            className="mx-auto flex max-w-4xl flex-col items-start gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: '#FFF8E0' }}>
              <Building2 className="h-8 w-8" style={{ color: '#1B2A4A' }} aria-hidden="true" />
            </div>
            <div>
              <h2 className="mb-1 text-xl font-bold text-gray-900">Run a gym, hotel, apartment or office fitness room?</h2>
              <p className="text-gray-600">
                Commercial cardio and strength repair, plus preventive maintenance visits.{' '}
                <span className="font-semibold" style={{ color: '#398ffc' }}>Commercial gym equipment →</span>
              </p>
            </div>
          </Link>
        </div>
      </section>

      <GymBrandsGrid
        brands={gymBrands}
        heading="Brands we work on"
        subheading="Home and commercial lines. Not on the list? Send us the model and we will confirm."
      />

      <GymProcess />

      <GymFaq faqs={gymHubFaqs} heading="Gym equipment repair: common questions" />

      <GymFinalCTA
        heading="Machine down? Let's get it running."
        text="Call or book online. A technician comes to you anywhere in Dallas-Fort Worth or Houston, and you get an upfront quote before any work starts."
        trackingLabel="gym_final_cta"
      />
    </>
  );
}
