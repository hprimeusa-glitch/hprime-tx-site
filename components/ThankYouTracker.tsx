'use client';

import { useEffect } from 'react';
import { FormType, LEAD_EVENTS } from '@/lib/formType';

// window.dataLayer is declared globally in lib/ab/client.tsx.

// Appliance leads push `thank_you` (unchanged); gym leads arrive with ?form=gym
// and push `gym_thank_you`, so the appliance conversion trigger never fires on them.
export default function ThankYouTracker({ formType = 'appliance' }: { formType?: FormType }) {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: LEAD_EVENTS[formType].thankYou, form_type: formType });
  }, [formType]);

  return null;
}
