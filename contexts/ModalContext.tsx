'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { FormType, formTypeForPath } from '@/lib/formType';

interface ModalContextType {
  isModalOpen: boolean;
  /** Which lead form the modal shows. Derived from the pathname: /gym and /gym/* → 'gym'. */
  formType: FormType;
  /** Opens the lead form. Pass a type only to override the pathname default. */
  openModal: (type?: FormType) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [override, setOverride] = useState<FormType | null>(null);

  const formType: FormType = override ?? formTypeForPath(pathname);

  const openModal = (type?: FormType) => {
    // Guard against openModal being passed straight to onClick (it would receive the event).
    setOverride(type === 'gym' || type === 'appliance' ? type : null);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setOverride(null);
  };

  return (
    <ModalContext.Provider value={{ isModalOpen, formType, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
