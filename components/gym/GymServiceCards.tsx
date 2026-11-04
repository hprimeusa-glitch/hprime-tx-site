import Image from 'next/image';
import Link from 'next/link';
import type { GymService } from '@/lib/data/gymServices';

export default function GymServiceCards({ services, heading, subheading }: { services: GymService[]; heading: string; subheading?: string }) {
  return (
    <section className="py-14 bg-white" id="equipment">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">{heading}</h2>
          {subheading && <p className="mx-auto max-w-2xl text-lg text-gray-600">{subheading}</p>}
        </div>
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/gym/${service.path}`}
              className="group overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md transition hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{service.cardTitle}</h3>
                <p className="mb-4 text-sm text-gray-600">{service.cardText}</p>
                <span className="text-sm font-semibold" style={{ color: '#398ffc' }}>
                  See {service.name} repair →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
