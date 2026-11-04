import type { GymFaq as GymFaqItem } from '@/lib/data/gymServices';

export default function GymFaq({ faqs, heading }: { faqs: GymFaqItem[]; heading: string }) {
  return (
    <section className="py-14 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-900 md:text-4xl">{heading}</h2>
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <details key={faq.q} className="group rounded-lg border border-gray-200 bg-white shadow-sm">
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 font-semibold text-gray-900 transition hover:text-blue-600">
                <span>{faq.q}</span>
                <span className="shrink-0 text-gray-400 transition-transform group-open:rotate-180" aria-hidden="true">▼</span>
              </summary>
              <div className="px-5 pb-5 leading-relaxed text-gray-600">{faq.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
