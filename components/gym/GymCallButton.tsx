import { Phone } from 'lucide-react';
import { PHONE_DISPLAY, PHONE_NUMBER } from '@/lib/utils';

export default function GymCallButton({ variant = 'light', className = '' }: { variant?: 'light' | 'navy'; className?: string }) {
  const styles =
    variant === 'light'
      ? { backgroundColor: '#FFFFFF', color: '#1B2A4A' }
      : { backgroundColor: '#1B2A4A', color: '#FFFFFF' };
  return (
    <a
      href={`tel:${PHONE_NUMBER}`}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold shadow-lg transition hover:brightness-95 ${className}`}
      style={styles}
    >
      <Phone size={20} aria-hidden="true" />
      <span className="whitespace-nowrap">{PHONE_DISPLAY}</span>
    </a>
  );
}
