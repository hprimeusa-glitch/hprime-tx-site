import Image from 'next/image';
import Link from 'next/link';
import type { GymService } from '@/lib/data/gymServices';

interface GymServiceCardsProps {
  services: GymService[];
  heading: string;
  subheading?: string;
  /** Defaults to /gym/<path>. Brand pages point the cards at /gym/brands/<brand>/<path>. */
  hrefFor?: (service: GymService) => string;
  /** Defaults to the card title ("Treadmill Repair"). */
  titleFor?: (service: GymService) => string;
  /** Defaults to "See <name> repair →". */
  linkTextFor?: (service: GymService) => string;
  /** Image override; return undefined to show a plain tile instead of a photo. */
  imageFor?: (service: GymService) => { src: string; alt: string } | undefined;
}

export default function GymServiceCards({ services, heading, subheading, hrefFor, titleFor, linkTextFor, imageFor }: GymServiceCardsProps) {
  return (
    <section className="py-14 bg-white" id="equipment">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">{heading}</h2>
          {subheading && <p className="mx-auto max-w-2xl text-lg text-gray-600">{subheading}</p>}
        </div>
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const img = imageFor ? imageFor(service) : { src: service.image, alt: service.imageAlt };
            return (
            <Link
              key={service.slug}
              href={hrefFor ? hrefFor(service) : `/gym/${service.path}`}
              className="group overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md transition hover:shadow-xl"
            >
              {img ? (
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="h-2 w-full" style={{ backgroundColor: '#FFC704' }} aria-hidden="true" />
              )}
              <div className="p-6">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{titleFor ? titleFor(service) : service.cardTitle}</h3>
                <p className="mb-4 text-sm text-gray-600">{service.cardText}</p>
                <span className="text-sm font-semibold" style={{ color: '#398ffc' }}>
                  {linkTextFor ? linkTextFor(service) : `See ${service.name} repair →`}
                </span>
              </div>
            </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
