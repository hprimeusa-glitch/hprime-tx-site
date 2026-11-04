import GymBookButton from './GymBookButton';
import GymCallButton from './GymCallButton';

export default function GymFinalCTA({ heading, text, trackingLabel }: { heading: string; text: string; trackingLabel: string }) {
  return (
    <section className="py-14 text-white" style={{ backgroundColor: '#1B2A4A' }}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">{heading}</h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">{text}</p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <GymCallButton variant="light" className="text-lg" />
          <GymBookButton trackingLabel={trackingLabel} className="text-lg" />
        </div>
      </div>
    </section>
  );
}
