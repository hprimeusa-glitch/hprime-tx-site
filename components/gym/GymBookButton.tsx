'use client';

import { Calendar } from 'lucide-react';
import { useModal } from '@/contexts/ModalContext';
import { pushOpenLeadForm } from '@/lib/formType';

interface GymBookButtonProps {
  trackingLabel: string;
  label?: string;
  className?: string;
}

/** Book CTA for the gym pages. Opens the shared modal, which shows the gym form on /gym/*. */
export default function GymBookButton({ trackingLabel, label = 'Book a Repair', className = '' }: GymBookButtonProps) {
  const { openModal } = useModal();
  return (
    <button
      type="button"
      onClick={() => {
        pushOpenLeadForm(trackingLabel);
        openModal();
      }}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold text-gray-900 shadow-lg transition hover:brightness-95 cursor-pointer ${className}`}
      style={{ backgroundColor: '#FFC704' }}
    >
      <Calendar size={20} aria-hidden="true" />
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}
