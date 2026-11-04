import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import GymBookButton from './GymBookButton';
import GymCallButton from './GymCallButton';
import { gymTrustPoints } from '@/lib/data/gymContent';

interface GymHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  trackingLabel: string;
}

// No entrance animation: the H1 is the LCP candidate and must paint at once.
export default function GymHero({ eyebrow, title, subtitle, image, imageAlt, trackingLabel }: GymHeroProps) {
  return (
    <section className="overflow-hidden text-white" style={{ backgroundColor: '#1B2A4A' }}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="min-w-0">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider" style={{ color: '#FFC704' }}>
              {eyebrow}
            </p>
            <h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">{title}</h1>
            <p className="mb-6 text-lg text-gray-200 md:text-xl">{subtitle}</p>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <GymCallButton variant="light" className="w-full sm:w-auto text-lg" />
              <GymBookButton trackingLabel={trackingLabel} className="w-full sm:w-auto text-lg" />
            </div>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm md:text-base">
              {gymTrustPoints.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" style={{ color: '#FFC704' }} aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl">
            <Image src={image} alt={imageAlt} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
