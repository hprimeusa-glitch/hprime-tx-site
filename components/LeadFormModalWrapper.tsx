'use client';

import { useModal } from '@/contexts/ModalContext';
import LeadFormModal from './LeadFormModal';

export default function LeadFormModalWrapper() {
  const { isModalOpen, closeModal, formType } = useModal();

  return <LeadFormModal isOpen={isModalOpen} onClose={closeModal} formType={formType} />;
}
