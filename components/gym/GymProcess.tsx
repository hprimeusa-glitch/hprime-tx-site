import { gymProcess } from '@/lib/data/gymContent';

export default function GymProcess({ heading = 'How it works' }: { heading?: string }) {
  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-900 md:text-4xl">{heading}</h2>
        <ol className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {gymProcess.map((step, i) => (
            <li key={step.title} className="rounded-lg border border-gray-100 bg-gray-50 p-6 shadow-sm">
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white"
                style={{ backgroundColor: '#1B2A4A' }}
                aria-hidden="true"
              >
                {i + 1}
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">{step.title}</h3>
              <p className="text-gray-600">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
