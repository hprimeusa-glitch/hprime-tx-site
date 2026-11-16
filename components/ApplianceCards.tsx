import Link from 'next/link';

export interface ApplianceCardItem {
  key: string;
  href: string;
  title: string;
  image?: string;
  alt?: string;
  note?: string;
}

interface Props {
  heading: string;
  subheading?: string;
  items: ApplianceCardItem[];
  className?: string;
}

/**
 * Appliance grid with the photo on top, the same look as "Our Services" on the
 * home page. Used wherever a page lists the appliance types it links to.
 */
export default function ApplianceCards({ heading, subheading, items, className = 'bg-white' }: Props) {
  if (items.length === 0) return null;
  return (
    <section className={`py-12 ${className}`}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{heading}</h2>
          {subheading && <p className="text-lg text-gray-600 mt-3">{subheading}</p>}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {items.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              prefetch={false}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden group border border-gray-100"
            >
              {item.image && (
                <div className="w-full h-28 md:h-36 overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.alt ?? item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-3 md:p-4">
                <h3 className="font-semibold text-gray-900 text-base md:text-lg leading-snug">{item.title}</h3>
                {item.note && <p className="text-sm text-gray-600 mt-1">{item.note}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
