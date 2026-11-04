'use client';

import { usePathname } from 'next/navigation';
import { isGymPath } from '@/lib/formType';

// Appliance credentials (EPA, Whirlpool) mean nothing on the gym section, so
// /gym pages show gym-neutral lines instead.
export default function FooterTrust() {
  const pathname = usePathname();

  if (isGymPath(pathname)) {
    return (
      <>
        <p className="text-sm mt-4">Home &amp; Commercial Gym Equipment</p>
        <p className="text-sm">Upfront Quote Before Any Work</p>
      </>
    );
  }

  return (
    <>
      <p className="text-sm mt-4">EPA Certified Technicians</p>
      <p className="text-sm">Whirlpool Trained</p>
      <p className="text-sm">Transparent Pricing — No Hidden Fees</p>
    </>
  );
}
