'use client';

import { X } from 'lucide-react';
import LeadForm from './LeadForm';
import type { FormType } from '@/lib/formType';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formType?: FormType;
}

const MODAL_TITLES: Record<FormType, string> = {
  appliance: 'Book Appliance Repair Service',
  gym: 'Book Gym Equipment Repair',
};

export default function LeadFormModal({ isOpen, onClose, formType = 'appliance' }: LeadFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
      <div className="relative w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="shrink-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between z-10">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            {MODAL_TITLES[formType]}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4">
          <LeadForm key={formType} variant="modal" formType={formType} onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
}
