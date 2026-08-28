import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarCheck, Clock, MapPin, Phone, ShieldCheck, Wrench } from 'lucide-react';
import LeadForm from '@/components/LeadForm';
import { TIME_SLOTS } from '@/lib/booking';
import { cities } from '@/lib/data/cities';
import { BUSINESS_NAME, PHONE_DISPLAY, PHONE_NUMBER } from '@/lib/utils';

const SITE_URL = 'https://tx.h-prime-co.com';

export const metadata: Metadata = {
  title: `Book Appliance Repair Online | Fort Worth, TX | ${BUSINESS_NAME}`,
  description: `Schedule an appliance repair appointment in the Fort Worth Metro area online. Pick your date and time window, EPA certified technicians, upfront pricing. Or call ${PHONE_DISPLAY}.`,
  alternates: { canonical: `${SITE_URL}/book` },
  openGraph: {
    title: 'Book Appliance Repair Online | Fort Worth, TX',
    description:
      'Pick a date and a time window for your appliance repair in the Fort Worth Metro area. Certified technicians, upfront pricing.',
    url: `${SITE_URL}/book`,
    type: 'website',
    locale: 'en_US',
    siteName: BUSINESS_NAME,
  },
};

const STEPS = [
  {
    icon: CalendarCheck,
    title: 'Pick a date and a time window',
    text: 'Tell us what broke, where you are, and when it works for you.',
  },
  {
    icon: Phone,
    title: 'We confirm by phone',
    text: 'A dispatcher calls you back within 15 minutes to lock in the visit.',
  },
  {
    icon: Wrench,
    title: 'A technician comes out',
    text: 'Diagnosis first, then an upfront price before any work starts.',
  },
];

const TRUST = [
  'EPA certified technicians',
  'Whirlpool trained',
  'All major brands serviced',
  'Transparent pricing — no hidden fees',
];

export default function BookPage() {
  return (
    <>
      {/* Hero band */}
      <section
        className="px-4 py-10 md:py-14"
        style={{ background: 'linear-gradient(160deg, #1B2A4A 0%, #0F1A30 100%)' }}
      >
        <div className="container mx-auto max-w-5xl text-center">
          <p
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: '#FFC704' }}
          >
            Fort Worth Metro · Monday–Friday
          </p>
          <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Book Appliance Repair Online
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-white/75">
            Choose the day and the time window that suit you. We confirm every appointment by
            phone before a technician is dispatched.
          </p>
          <a
            href={`tel:${PHONE_NUMBER}`}
            className="mt-6 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-gray-900 transition hover:brightness-95"
            style={{ backgroundColor: '#FFC704' }}
          >
            <Phone size={18} />
            Prefer to call? {PHONE_DISPLAY}
          </a>
        </div>
      </section>

      {/* Form + supporting info */}
      <section className="bg-gradient-to-br from-blue-50 to-orange-50 px-4 py-10 md:py-14">
        <div className="container mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          {/* Booking form */}
          <div className="rounded-2xl bg-white p-6 shadow-xl md:p-8">
            <h2 className="text-2xl font-bold text-gray-900">Schedule your visit</h2>
            <p className="mt-1 mb-5 text-sm text-gray-600">
              Two quick steps — contact details, then address and preferred time.
            </p>
            <LeadForm variant="modal" />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="text-lg font-bold text-gray-900">How it works</h2>
              <ol className="mt-4 space-y-4">
                {STEPS.map(({ icon: Icon, title, text }, i) => (
                  <li key={title} className="flex gap-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
                      style={{ backgroundColor: '#1B2A4A' }}
                      aria-hidden="true"
                    >
                      <Icon size={18} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {i + 1}. {title}
                      </p>
                      <p className="text-sm text-gray-600">{text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <Clock size={18} style={{ color: '#1B2A4A' }} />
                Time windows
              </h2>
              <ul className="mt-3 space-y-2">
                {TIME_SLOTS.map((slot) => (
                  <li
                    key={slot}
                    className="rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-800"
                  >
                    {slot}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-gray-500">
                Online booking is available Monday through Friday. Need a weekend or an
                after-hours visit? Call {PHONE_DISPLAY} and we will fit you in.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <MapPin size={18} style={{ color: '#1B2A4A' }} />
                Areas we serve
              </h2>
              <p className="mt-3 text-sm text-gray-600">
                {cities.map((city) => city.name).join(' · ')}
              </p>
              <Link
                href="/service-areas"
                className="mt-3 inline-block text-sm font-semibold hover:underline"
                style={{ color: '#1B2A4A' }}
              >
                See the full service area →
              </Link>
            </div>

            <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: '#1B2A4A' }}>
              <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                <ShieldCheck size={18} style={{ color: '#FFC704' }} />
                Why H-Prime
              </h2>
              <ul className="mt-3 space-y-2">
                {TRUST.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-white/80">
                    <span style={{ color: '#FFC704' }} aria-hidden="true">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
