'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isGymPath } from '@/lib/formType';

// Gym equipment is serviced in Dallas-Fort Worth only (owner, 2026-11-05), so
// /gym pages drop Houston from the footer. Appliance pages keep both markets.
const GYM_EXCLUDED_SLUGS = new Set(['harris']);

export function FooterServing() {
  const pathname = usePathname();
  return (
    <p className="text-sm mb-2">
      {isGymPath(pathname) ? 'Serving Dallas-Fort Worth' : 'Serving Dallas-Fort Worth & Houston'}
    </p>
  );
}

export function FooterAreaLinks({ areas }: { areas: { name: string; slug: string }[] }) {
  const pathname = usePathname();
  const shown = isGymPath(pathname) ? areas.filter((a) => !GYM_EXCLUDED_SLUGS.has(a.slug)) : areas;
  return (
    <>
      {shown.map((area) => (
        <li key={area.name}>
          <Link href={`/service-areas#${area.slug}`} className="hover:text-white transition text-sm">
            {area.name}
          </Link>
        </li>
      ))}
    </>
  );
}
