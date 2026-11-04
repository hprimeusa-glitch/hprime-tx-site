import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ClipboardCheck, Info, Wrench } from 'lucide-react';
import GymHero from '@/components/gym/GymHero';
import GymProcess from '@/components/gym/GymProcess';
import GymFaq from '@/components/gym/GymFaq';
import GymFinalCTA from '@/components/gym/GymFinalCTA';
import JsonLd from '@/components/gym/JsonLd';
import { gymBrands, getGymBrand, hasBrandEquipment, brandEquipmentImage } from '@/lib/data/gymBrands';
import { getGymService } from '@/lib/data/gymServices';
import { brandEquipmentCopy, independentLine, servicesForBrand } from '@/lib/data/gymBrandContent';
import { gymMetadata, gymBreadcrumbSchema } from '@/lib/seo/gymSeo';

// Only brand + equipment pairs from equipmentBrandMap exist; everything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return gymBrands.flatMap((b) => servicesForBrand(b.slug).map((s) => ({ brand: b.slug, equipment: s.path })));
}

type Props = { params: Promise<{ brand: string; equipment: string }> };

function resolve(brandSlug: string, equipmentPath: string) {
  const brand = getGymBrand(brandSlug);
  const service = getGymService(equipmentPath);
  if (!brand || !service || !hasBrandEquipment(brand.slug, service.slug)) return null;
  return { brand, service };
}

export async function generateMetadata({ params }: Props) {
  const { brand: b, equipment: e } = await params;
  const found = resolve(b, e);
  if (!found) return {};
  const copy = brandEquipmentCopy(found.brand, found.service);
  return gymMetadata({
    path: `/gym/brands/${found.brand.slug}/${found.service.path}`,
    title: copy.title,
    description: copy.description,
    indexable: false,
  });
}

export default async function GymBrandEquipmentPage({ params }: Props) {
  const { brand: b, equipment: e } = await params;
  const found = resolve(b, e);
  if (!found) notFound();
  const { brand, service } = found;
  const copy = brandEquipmentCopy(brand, service);
  const brandPath = `/gym/brands/${brand.slug}`;
  const path = `${brandPath}/${service.path}`;
  const otherEquipment = servicesForBrand(brand.slug).filter((s) => s.slug !== service.slug);

  return (
    <>
      <JsonLd
        data={gymBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Gym Equipment Repair', path: '/gym' },
          { name: 'Brands', path: '/gym/brands' },
          { name: `${brand.name} Repair`, path: brandPath },
          { name: `${brand.name} ${service.label} Repair`, path },
        ])}
      />

      <GymHero
        eyebrow={`${service.cardTitle} · Dallas-Fort Worth & Houston`}
        title={copy.h1}
        subtitle={copy.subtitle}
        image={brandEquipmentImage(brand.slug, service.slug)}
        imageAlt={`${brand.name} ${service.label.toLowerCase()}`}
        trackingLabel={`gym_combo_${brand.slug}_${service.slug}_hero`}
        brand={brand}
      />

      <nav aria-label="Breadcrumb" className="bg-gray-50 border-b border-gray-200">
        <ol className="container mx-auto flex flex-wrap gap-x-2 px-4 py-3 text-sm text-gray-600">
          <li><Link href="/gym" className="hover:underline">Gym Equipment Repair</Link> /</li>
          <li><Link href={brandPath} className="hover:underline">{brand.name}</Link> /</li>
          <li className="text-gray-900">{service.label}</li>
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

      {copy.notes.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
              What we see on {brand.name} {service.label.toLowerCase()}s
            </h2>
            <ul className="space-y-4">
              {copy.notes.map((n) => (
                <li key={n.title} className="flex items-start gap-3">
                  <Wrench className="mt-1 h-5 w-5 shrink-0" style={{ color: '#1B2A4A' }} aria-hidden="true" />
                  <div>
                    <h3 className="font-bold text-gray-900">{n.title}</h3>
                    <p className="text-gray-700">{n.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            {brand.name} {service.label.toLowerCase()} problems we fix
          </h2>
          <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {service.problems.map((problem) => (
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

      <section className="py-14 bg-white">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">{service.checksHeading}</h2>
          <ul className="space-y-3">
            {service.checks.map((check) => (
              <li key={check} className="flex items-start gap-3 text-gray-700">
                <ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0" style={{ color: '#1B2A4A' }} aria-hidden="true" />
                <span>{check}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <GymProcess />

      <GymFaq faqs={copy.faqs} heading={`${brand.name} ${service.label.toLowerCase()} repair: common questions`} />

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">More {brand.name} repair</h2>
          <ul className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3">
            {otherEquipment.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`${brandPath}/${s.path}`}
                  className="inline-block rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-gray-500"
                >
                  {brand.name} {s.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={brandPath}
                className="inline-block rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-gray-500"
              >
                All {brand.name} repair
              </Link>
            </li>
            <li>
              <Link
                href={`/gym/${service.path}`}
                className="inline-block rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-gray-500"
              >
                {service.cardTitle}, all brands
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <GymFinalCTA
        heading={`Need ${brand.name} ${service.label.toLowerCase()} repair?`}
        text="Call or book online. A technician comes to you in Dallas-Fort Worth or Houston, and you get an upfront quote before any work starts."
        trackingLabel={`gym_combo_${brand.slug}_${service.slug}_final_cta`}
      />
    </>
  );
}
