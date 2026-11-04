// Which lead form a page opens. The gym section lives under /gym; every CTA on
// those pages opens the gym variant without per-button wiring, because the
// type is derived from the pathname in ModalContext.

export type FormType = 'appliance' | 'gym';

export const isGymPath = (pathname: string | null | undefined): boolean =>
  pathname === '/gym' || Boolean(pathname?.startsWith('/gym/'));

export const formTypeForPath = (pathname: string | null | undefined): FormType =>
  isGymPath(pathname) ? 'gym' : 'appliance';

/** Anything other than an explicit 'gym' is treated as the appliance form. */
export const parseFormType = (value: unknown): FormType => (value === 'gym' ? 'gym' : 'appliance');

/**
 * dataLayer event names. Gym events are deliberately distinct so the existing
 * GTM conversion triggers for the appliance form never fire on a gym lead.
 */
export const LEAD_EVENTS: Record<FormType, { open: string; submitted: string; thankYou: string }> = {
  appliance: { open: 'open_lead_form', submitted: 'lead_submitted', thankYou: 'thank_you' },
  gym: { open: 'gym_open_lead_form', submitted: 'gym_lead_submitted', thankYou: 'gym_thank_you' },
};

type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] };

/** Push the "lead form opened" event for whichever form the current page uses. */
export function pushOpenLeadForm(label: string): void {
  if (typeof window === 'undefined') return;
  const w = window as DataLayerWindow;
  if (!w.dataLayer) return;
  const formType = formTypeForPath(window.location.pathname);
  w.dataLayer.push({
    event: LEAD_EVENTS[formType].open,
    label,
    form_type: formType,
  });
}
