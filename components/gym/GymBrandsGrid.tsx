import Image from 'next/image';
import type { GymBrand } from '@/lib/data/gymBrands';

export default function GymBrandsGrid({ brands, heading, subheading }: { brands: GymBrand[]; heading: string; subheading?: string }) {
  return (
    <section className="py-14 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">{heading}</h2>
          {subheading && <p className="mx-auto max-w-2xl text-lg text-gray-600">{subheading}</p>}
        </div>
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {brands.map((brand) => (
            <li
              key={brand.slug}
              className="flex h-20 items-center justify-center rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
            >
              <Image
                src={brand.logo}
                alt={`${brand.name} logo`}
                width={160}
                height={56}
                className="h-12 w-auto max-w-full object-contain"
              />
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-gray-500">
          H-Prime is an independent repair service and is not affiliated with or authorized by these manufacturers. Brand names and logos belong to their owners and show the equipment we work on.
        </p>
      </div>
    </section>
  );
}
