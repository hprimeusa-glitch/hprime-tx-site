import Link from 'next/link';
import GymFinalCTA from '@/components/gym/GymFinalCTA';
import JsonLd from '@/components/gym/JsonLd';
import { GymBrandTile } from '@/components/gym/GymBrandsGrid';
import { gymBrands } from '@/lib/data/gymBrands';
import { servicesForBrand } from '@/lib/data/gymBrandContent';
import { gymMetadata, gymBreadcrumbSchema } from '@/lib/seo/gymSeo';

export const metadata = gymMetadata({
  path: '/gym/brands',
  title: 'Gym Equipment Brands We Repair in DFW | H-Prime',
  description:
    'Fitness equipment brands H-Prime repairs across Dallas-Fort Worth: NordicTrack, Peloton, Life Fitness, Precor, Concept2 and more. Upfront quote before any work starts.',
  indexable: false,
});

const brands = [...gymBrands].sort((a, b) => a.name.localeCompare(b.name));

export default function GymBrandsIndexPage() {
  return (
    <>
      <JsonLd
        data={gymBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Gym Equipment Repair', path: '/gym' },
          { name: 'Brands', path: '/gym/brands' },
        ])}
      />
      <section className="text-white" style={{ backgroundColor: '#1B2A4A' }}>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider" style={{ color: '#FFC704' }}>
            Gym equipment repair
          </p>
          <h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">Gym Equipment Brands We Repair</h1>
          <p className="max-w-2xl text-lg text-gray-200 md:text-xl">
            Home and commercial fitness equipment across Dallas-Fort Worth. Pick your brand to see what we fix.
          </p>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <ul className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => {
              const services = servicesForBrand(brand.slug);
              return (
                <li key={brand.slug} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                  <Link href={`/gym/brands/${brand.slug}`} className="mb-3 flex h-16 items-center justify-center" aria-label={`${brand.name} repair`}>
                    <GymBrandTile brand={brand} />
                  </Link>
                  <Link href={`/gym/brands/${brand.slug}`} className="mb-2 block text-lg font-bold text-gray-900 hover:underline">
                    {brand.name} repair
                  </Link>
                  <ul className="flex flex-wrap gap-2">
                    {services.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/gym/brands/${brand.slug}/${s.path}`}
                          className="inline-block rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-700 transition hover:border-gray-500"
                        >
                          {s.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
          <p className="mx-auto mt-8 max-w-3xl text-center text-xs text-gray-500">
            H-Prime is an independent repair service and is not affiliated with or authorized by these manufacturers. Brand names and logos belong to their owners and show the equipment we work on.
          </p>
        </div>
      </section>

      <GymFinalCTA
        heading="Brand not listed?"
        text="Send us the brand and model when you book, or call. We will confirm before the visit, and you get an upfront quote before any work starts."
        trackingLabel="gym_brands_index_final_cta"
      />
    </>
  );
}
