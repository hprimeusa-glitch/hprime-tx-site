import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ClipboardCheck } from 'lucide-react';
import GymHero from '@/components/gym/GymHero';
import GymBrandsGrid from '@/components/gym/GymBrandsGrid';
import GymProcess from '@/components/gym/GymProcess';
import GymFaq from '@/components/gym/GymFaq';
import GymFinalCTA from '@/components/gym/GymFinalCTA';
import JsonLd from '@/components/gym/JsonLd';
import { gymServices, getGymService } from '@/lib/data/gymServices';
import { getBrandsForEquipment } from '@/lib/data/gymBrands';
import { GYM_AREA } from '@/lib/data/gymContent';
import { gymMetadata, gymServiceSchema, gymFaqSchema, gymBreadcrumbSchema } from '@/lib/seo/gymSeo';

// Only the six known equipment pages exist; anything else under /gym/ 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return gymServices.map((s) => ({ equipment: s.path }));
}

type Props = { params: Promise<{ equipment: string }> };

export async function generateMetadata({ params }: Props) {
  const { equipment } = await params;
  const service = getGymService(equipment);
  if (!service) return {};
  return gymMetadata({
    path: `/gym/${service.path}`,
    title: service.title,
    description: service.description,
    indexable: service.indexable,
  });
}

export default async function GymServicePage({ params }: Props) {
  const { equipment } = await params;
  const service = getGymService(equipment);
  if (!service) notFound();

  const path = `/gym/${service.path}`;
  const others = gymServices.filter((s) => s.slug !== service.slug);

  return (
    <>
      {service.indexable && (
        <>
          <JsonLd
            data={gymServiceSchema({
              path,
              name: service.cardTitle,
              serviceType: service.cardTitle,
              description: service.description,
            })}
          />
          <JsonLd data={gymFaqSchema(service.faqs)} />
        </>
      )}
      <JsonLd
        data={gymBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Gym Equipment Repair', path: '/gym' },
          { name: service.cardTitle, path },
        ])}
      />

      <GymHero
        eyebrow={`${service.cardTitle} · ${GYM_AREA}`}
        title={service.h1}
        subtitle={service.subtitle}
        image={service.image}
        imageAlt={service.imageAlt}
        trackingLabel={`gym_${service.slug}_hero`}
      />

      <nav aria-label="Breadcrumb" className="bg-gray-50 border-b border-gray-200">
        <ol className="container mx-auto flex flex-wrap gap-x-2 px-4 py-3 text-sm text-gray-600">
          <li><Link href="/" className="hover:underline">Home</Link> /</li>
          <li><Link href="/gym" className="hover:underline">Gym Equipment Repair</Link> /</li>
          <li className="text-gray-900">{service.cardTitle}</li>
        </ol>
      </nav>

      <section className="py-12 bg-white">
        <div className="container mx-auto max-w-3xl space-y-4 px-4 text-base leading-relaxed text-gray-700 md:text-lg">
          {service.intro.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </div>
      </section>

      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900 md:text-4xl">{service.problemsHeading}</h2>
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

      <GymBrandsGrid
        brands={getBrandsForEquipment(service.slug)}
        heading={`${service.cardTitle}: brands we work on`}
        subheading="Not on the list? Send us the model and we will confirm before the visit."
        hrefFor={(brand) => `/gym/brands/${brand.slug}/${service.path}`}
        footerLink={{ href: '/gym/brands', label: 'All brands we repair →' }}
      />

      <GymProcess />

      <GymFaq faqs={service.faqs} heading={`${service.cardTitle}: common questions`} />

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">Other equipment we repair</h2>
          <ul className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3">
            {others.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/gym/${s.path}`}
                  className="inline-block rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-gray-500"
                >
                  {s.cardTitle}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/gym/commercial"
                className="inline-block rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-gray-500"
              >
                Commercial gym equipment
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <GymFinalCTA
        heading={`Need ${service.name} repair?`}
        text="Call or book online. A technician comes to you in Dallas-Fort Worth, and you get an upfront quote before any work starts."
        trackingLabel={`gym_${service.slug}_final_cta`}
      />
    </>
  );
}
