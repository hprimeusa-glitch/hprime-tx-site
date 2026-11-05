import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, Info } from 'lucide-react';
import GymHero from '@/components/gym/GymHero';
import GymServiceCards from '@/components/gym/GymServiceCards';
import GymProcess from '@/components/gym/GymProcess';
import GymFaq from '@/components/gym/GymFaq';
import GymFinalCTA from '@/components/gym/GymFinalCTA';
import JsonLd from '@/components/gym/JsonLd';
import { gymBrands, getGymBrand, brandEquipmentImage } from '@/lib/data/gymBrands';
import { brandPageCopy, independentLine } from '@/lib/data/gymBrandContent';
import { gymMetadata, gymBreadcrumbSchema } from '@/lib/seo/gymSeo';

export const dynamicParams = false;

export function generateStaticParams() {
  return gymBrands.map((b) => ({ brand: b.slug }));
}

type Props = { params: Promise<{ brand: string }> };

export async function generateMetadata({ params }: Props) {
  const { brand: slug } = await params;
  const brand = getGymBrand(slug);
  if (!brand) return {};
  const copy = brandPageCopy(brand);
  return gymMetadata({ path: `/gym/brands/${brand.slug}`, title: copy.title, description: copy.description, indexable: false });
}

export default async function GymBrandPage({ params }: Props) {
  const { brand: slug } = await params;
  const brand = getGymBrand(slug);
  if (!brand) notFound();
  const copy = brandPageCopy(brand);
  const path = `/gym/brands/${brand.slug}`;
  const heroService = copy.services.find((s) => brandEquipmentImage(brand.slug, s.slug));
  const heroImage = heroService && brandEquipmentImage(brand.slug, heroService.slug);

  return (
    <>
      <JsonLd
        data={gymBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Gym Equipment Repair', path: '/gym' },
          { name: 'Brands', path: '/gym/brands' },
          { name: `${brand.name} Repair`, path },
        ])}
      />

      <GymHero
        eyebrow="Gym equipment repair · Dallas-Fort Worth"
        title={copy.h1}
        subtitle={copy.subtitle}
        image={heroImage}
        imageAlt={heroService ? `${brand.name} ${heroService.label.toLowerCase()}` : undefined}
        trackingLabel={`gym_brand_${brand.slug}_hero`}
        brand={brand}
      />

      <nav aria-label="Breadcrumb" className="bg-gray-50 border-b border-gray-200">
        <ol className="container mx-auto flex flex-wrap gap-x-2 px-4 py-3 text-sm text-gray-600">
          <li><Link href="/" className="hover:underline">Home</Link> /</li>
          <li><Link href="/gym" className="hover:underline">Gym Equipment Repair</Link> /</li>
          <li><Link href="/gym/brands" className="hover:underline">Brands</Link> /</li>
          <li className="text-gray-900">{brand.name}</li>
        </ol>
      </nav>

      <section className="py-12 bg-white">
        <div className="container mx-auto max-w-3xl space-y-4 px-4 text-base leading-relaxed text-gray-700 md:text-lg">
          {copy.intro.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
          <p className="flex items-start gap-2 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{independentLine(brand)}</span>
          </p>
        </div>
      </section>

      <GymServiceCards
        services={copy.services}
        heading={`${brand.name} equipment we repair`}
        hrefFor={(s) => `${path}/${s.path}`}
        titleFor={(s) => `${brand.name} ${s.label} Repair`}
        linkTextFor={(s) => `See ${brand.name} ${s.label.toLowerCase()} repair →`}
        imageFor={(s) => {
          const src = brandEquipmentImage(brand.slug, s.slug);
          return src ? { src, alt: `${brand.name} ${s.label.toLowerCase()}` } : undefined;
        }}
      />

      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900 md:text-4xl">Common problems on {brand.name} machines</h2>
          <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {copy.problems.map((problem) => (
              <div key={problem.title} className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 shrink-0" style={{ color: '#FFC704' }} aria-hidden="true" />
                  <h3 className="text-lg font-bold text-gray-900">{problem.title}</h3>
                </div>
                <p className="text-gray-600">{problem.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {copy.models.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">{brand.name} models we see</h2>
            <ul className="flex flex-wrap gap-2">
              {copy.models.map((m) => (
                <li key={m} className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800">{m}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-gray-500">Not your model? Send us the model number and we will confirm before the visit.</p>
          </div>
        </section>
      )}

      <GymProcess />

      <GymFaq faqs={copy.faqs} heading={`${brand.name} repair: common questions`} />

      <GymFinalCTA
        heading={`Need ${brand.name} repair?`}
        text="Call or book online. A technician comes to you in Dallas-Fort Worth, and you get an upfront quote before any work starts."
        trackingLabel={`gym_brand_${brand.slug}_final_cta`}
      />
    </>
  );
}
