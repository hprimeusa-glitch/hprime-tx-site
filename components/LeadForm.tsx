'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PatternFormat } from 'react-number-format';
import {
  SlotStatus,
  TIME_SLOT_DEFS,
  bookingDaysHint,
  businessNow,
  closedRangeFor,
  dayOffMessage,
  isBookingDay,
  isSlotOpen,
  marketForZip,
} from '@/lib/booking';
import { FormType, LEAD_EVENTS } from '@/lib/formType';
import { appliances } from '@/lib/data/appliances';
import { AbExposure, abTrack, useVariant } from '@/lib/ab/client';

// A/B test hprime-tx-form-short (lib/ab/config.ts, appliance form only):
//  A = step 1 first name, last name, phone, email, issue (all required), step 2 address + booking.
//  B = step 1 only name, phone and appliance; step 2 keeps everything the dispatcher gets today
//      (address, ZIP, date, window) plus email and brand/problem, both optional.
const FORM_TEST_ID = 'hprime-tx-form-short';
const APPLIANCE_OPTIONS = [...appliances.map((a) => a.name), 'Other'];

// The free-text field is the only visible difference between the two forms.
// Its value is sent as `appliance` in both cases; the API reads `formType`.
const ISSUE_FIELD: Record<FormType, { label: string; placeholder: string }> = {
  appliance: {
    label: 'What appliance needs repair? *',
    placeholder: 'My Samsung refrigerator is not cooling',
  },
  gym: {
    label: 'What gym equipment needs repair? *',
    placeholder: 'e.g. NordicTrack treadmill, belt slipping',
  },
};

// Booking days (lib/booking isBookingDay): Monday to Saturday in Dallas-Fort Worth and
// for the gym form, Monday to Friday for a Houston appliance ZIP, never Sunday. A native
// <input type="date"> can't grey out days, so we reject them in validation and show a
// hint. Sunday is refused on the date field itself; Saturday depends on the ZIP, so the
// date + ZIP pair is checked at submit. Dates are judged in the shop's timezone, not the
// visitor's, so a customer two timezones away sees the same day.
// Closed days (lib/booking CLOSED_DATE_RANGES) differ per form, hence a schema per form type.
const makeFormSchema = (formType: FormType, short: boolean) => z.object({
  firstName: short ? z.string().optional() : z.string().min(2, 'First name must be at least 2 characters'),
  lastName: short ? z.string().optional() : z.string().min(2, 'Last name must be at least 2 characters'),
  fullName: short ? z.string().trim().min(2, 'Please enter your name') : z.string().optional(),
  applianceType: short ? z.string().min(1, 'Please choose the appliance') : z.string().optional(),
  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .refine((val) => val.replace(/\D/g, '').length === 10, 'Please enter a complete 10-digit phone number'),
  email: short
    ? z.union([z.literal(''), z.string().trim().email('Please enter a valid email')]).optional()
    : z.string().email('Please enter a valid email'),
  message: short ? z.string().optional() : z.string().min(5, 'Please describe the issue (minimum 5 characters)'),
  street: z.string().min(3, 'Street address is required'),
  apartment: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  zipCode: z.string().min(5, 'Please enter a valid 5-digit ZIP code'),
  preferredDate: z
    .string()
    .min(1, 'Please select a preferred date')
    .refine((val) => isBookingDay(val, formType), {
      message: 'We do not book online on Sundays. Please choose another day, or call us.',
    })
    .refine((val) => val >= businessNow().date, {
      message: 'Please choose today or a later date.',
    }),
  preferredTimeSlot: z.string().min(1, 'Please select a time slot'),
}).superRefine((data, ctx) => {
  const market = marketForZip(data.zipCode);
  const dayOff = data.preferredDate ? dayOffMessage(data.preferredDate, formType, market) : null;
  if (dayOff) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['preferredDate'],
      message: dayOff,
    });
    return;
  }
  const closed = data.preferredDate ? closedRangeFor(data.preferredDate, formType) : null;
  if (closed) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['preferredDate'],
      message: `Online booking is closed ${closed.label}. Please pick another date or call us.`,
    });
    return;
  }
  if (data.preferredDate && data.preferredTimeSlot && !isSlotOpen(data.preferredDate, data.preferredTimeSlot, businessNow(), formType, market)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['preferredTimeSlot'],
      message: 'This window has already started — please pick a later one.',
    });
  }
});

type FormData = z.infer<ReturnType<typeof makeFormSchema>>;

const STEP_1_FIELDS: Array<keyof FormData> = ['firstName', 'lastName', 'phone', 'email', 'message'];
const STEP_1_FIELDS_SHORT: Array<keyof FormData> = ['fullName', 'phone', 'applianceType'];

interface LeadFormProps {
  variant?: 'section' | 'modal';
  formType?: FormType;
  onSuccess?: () => void;
}

export default function LeadForm({ variant = 'section', formType = 'appliance', onSuccess }: LeadFormProps) {
  const isGym = formType === 'gym';
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'slot_full' | 'slot_closed' | 'day_closed'>('idle');
  const [slotStatus, setSlotStatus] = useState<Record<string, SlotStatus> | null>(null);
  // From the server: the closure covering the picked date, and closures still ahead.
  const [dayClosed, setDayClosed] = useState<string | null>(null);
  const [closures, setClosures] = useState<string[]>([]);
  // Variant is null until mounted (control meanwhile); the modal mounts on click, so no flash.
  const formVariant = useVariant(FORM_TEST_ID);
  const short = !isGym && formVariant === 'B';
  const formSchema = useMemo(() => makeFormSchema(formType, short), [formType, short]);
  // The resolver reads the current schema, so a variant resolved after mount is honoured.
  const schemaRef = useRef(formSchema);
  schemaRef.current = formSchema;
  const startedRef = useRef(false);
  useEffect(() => {
    abTrack('form_open');
  }, []);
  // The earliest day still worth offering, from the server: today while a window is
  // open, the next booking day once they have all started. Empty until it loads, so a
  // statically cached page never ships a stale date.
  const [minDate, setMinDate] = useState<string>('');
  const [availabilityRefresh, setAvailabilityRefresh] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    trigger,
    watch,
  } = useForm<FormData>({
    resolver: (values, context, options) => zodResolver(schemaRef.current)(values, context, options),
    mode: 'onTouched',
  });

  const selectedDate = watch('preferredDate');
  // The ZIP decides the market (Houston appliance = Monday to Friday). Only a complete
  // ZIP is sent, so typing does not refetch on every digit.
  const zipDigits = String(watch('zipCode') ?? '').replace(/\D/g, '');
  const bookingZip = zipDigits.length === 5 ? zipDigits : '';
  const market = marketForZip(bookingZip);
  const dayOff = selectedDate ? dayOffMessage(selectedDate, formType, market) : null;

  useEffect(() => {
    const hasDate = Boolean(selectedDate) && /^\d{4}-\d{2}-\d{2}$/.test(selectedDate);
    let cancelled = false;
    const query = new URLSearchParams();
    if (hasDate) query.set('date', selectedDate);
    if (isGym) query.set('form', 'gym');
    if (bookingZip) query.set('zip', bookingZip);
    const qs = query.toString();
    fetch(qs ? `/api/slot-availability?${qs}` : '/api/slot-availability')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (cancelled) return;
        if (json?.minDate) setMinDate(json.minDate);
        setSlotStatus(hasDate ? json?.status ?? null : null);
        setDayClosed(hasDate ? json?.dayClosed ?? null : null);
        if (Array.isArray(json?.closures)) setClosures(json.closures);
      })
      .catch(() => {
        if (!cancelled) setSlotStatus(null);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedDate, availabilityRefresh, isGym, bookingZip]);

  const goToStep2 = async () => {
    const valid = await trigger(short ? STEP_1_FIELDS_SHORT : STEP_1_FIELDS);
    if (valid) setStep(2);
  };

  const goToStep1 = () => setStep(1);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const cleanedPhone = data.phone.replace(/\D/g, '');
      const cleanText = (text: string) =>
        text.replace(/["']/g, '').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      // Variant B asks one name field; split it so the API and enhanced conversions keep
      // first/last name. Email and the issue text are optional there.
      const nameParts = short ? cleanText(data.fullName || '').split(' ') : [];
      const firstName = short ? nameParts[0] || '' : data.firstName || '';
      const lastName = short ? nameParts.slice(1).join(' ') : data.lastName || '';
      const email = (data.email || '').trim();
      const issue = cleanText(data.message || '');
      const applianceText = short
        ? [data.applianceType, issue].filter(Boolean).join(': ')
        : issue;

      let attribution: Record<string, string> = {};
      try {
        const stored = sessionStorage.getItem('hprime_attribution');
        if (stored) attribution = JSON.parse(stored);
      } catch {
        // sessionStorage unavailable, skip
      }

      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          firstName,
          lastName,
          phone: cleanedPhone,
          email,
          street: cleanText(data.street),
          apartment: cleanText(data.apartment || ''),
          city: cleanText(data.city),
          zipCode: data.zipCode,
          appliance: applianceText,
          preferredDate: data.preferredDate,
          preferredTimeSlot: data.preferredTimeSlot,
          ...(isGym && { formType: 'gym' }),
          attribution,
          submission_page: typeof window !== 'undefined' ? window.location.pathname + window.location.search : '',
        }),
      });

      if (response.ok) {
        if (typeof window !== 'undefined' && (window as { dataLayer?: Record<string, unknown>[] }).dataLayer) {
          (window as { dataLayer: Record<string, unknown>[] }).dataLayer.push({
            event: LEAD_EVENTS[formType].submitted,
            form_type: formType,
            enhanced_conversions: {
              ...(email && { email }),
              phone_number: `+1${cleanedPhone}`,
              first_name: firstName,
              ...(lastName && { last_name: lastName }),
              street: data.street,
              city: data.city,
              region: 'TX',
              postal_code: data.zipCode,
              country: 'US',
            },
          });
        }
        setSubmitStatus('success');
        reset();
        if (onSuccess) onSuccess();
        const tyParams = new URLSearchParams({
          date: data.preferredDate,
          time: data.preferredTimeSlot,
        });
        if (isGym) tyParams.set('form', 'gym');
        router.push(`/thank-you-page?${tyParams.toString()}`);
      } else if (response.status === 409) {
        const body = await response.json().catch(() => null);
        setSubmitStatus(
          body?.reason === 'day_closed' ? 'day_closed' : body?.reason === 'closed' ? 'slot_closed' : 'slot_full'
        );
        setAvailabilityRefresh((k) => k + 1);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const noSlotsLeft = Boolean(slotStatus) && TIME_SLOT_DEFS.every(({ label }) => slotStatus?.[label] !== 'open');

  const inputCls =
    'w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  const labelCls = 'block text-sm font-semibold text-gray-700 mb-1';
  const errorCls = 'text-red-600 text-xs mt-0.5';

  const stepIndicator = (
    <div className="flex items-center justify-center gap-2 mb-4" aria-label={`Step ${step} of 2`}>
      <div
        className={`h-2 w-12 rounded-full transition-colors ${step === 1 ? 'bg-[#1B2A4A]' : 'bg-gray-300'}`}
        aria-hidden="true"
      />
      <div
        className={`h-2 w-12 rounded-full transition-colors ${step === 2 ? 'bg-[#1B2A4A]' : 'bg-gray-300'}`}
        aria-hidden="true"
      />
      <span className="ml-2 text-xs text-gray-500">{step}/2</span>
    </div>
  );

  const step1 = (
    <div key="step1" className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="firstName" className={labelCls}>First name *</label>
          <input {...register('firstName')} type="text" id="firstName" className={inputCls} placeholder="John" autoComplete="given-name" />
          {errors.firstName && <p className={errorCls}>{errors.firstName.message}</p>}
        </div>
        <div>
          <label htmlFor="lastName" className={labelCls}>Last name *</label>
          <input {...register('lastName')} type="text" id="lastName" className={inputCls} placeholder="Smith" autoComplete="family-name" />
          {errors.lastName && <p className={errorCls}>{errors.lastName.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="phone" className={labelCls}>Phone *</label>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <PatternFormat
              {...field}
              format="(###) ###-####"
              mask="_"
              placeholder="(817) 555-0123"
              className={inputCls}
              type="tel"
              autoComplete="tel"
            />
          )}
        />
        {errors.phone && <p className={errorCls}>{errors.phone.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className={labelCls}>E-mail *</label>
        <input {...register('email')} type="email" id="email" className={inputCls} placeholder="john@example.com" autoComplete="email" inputMode="email" />
        {errors.email && <p className={errorCls}>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="message" className={labelCls}>{ISSUE_FIELD[formType].label}</label>
        <textarea
          {...register('message')}
          id="message"
          rows={3}
          className={inputCls}
          placeholder={ISSUE_FIELD[formType].placeholder}
        />
        {errors.message && <p className={errorCls}>{errors.message.message}</p>}
      </div>

      <button
        type="button"
        onClick={goToStep2}
        className="w-full text-white py-3 rounded-lg transition font-semibold text-base shadow-lg hover:shadow-xl"
        style={{ backgroundColor: '#1B2A4A' }}
      >
        Continue →
      </button>
    </div>
  );

  // Distinct keys: without them React reuses step 1's name input as step 2's street input
  // (same tree position) and the typed name shows up as the street address.
  const step1Short = (
    <div key="step1-short" className="space-y-3">
      <div>
        <label htmlFor="fullName" className={labelCls}>Your name *</label>
        <input {...register('fullName')} type="text" id="fullName" className={inputCls} placeholder="John Smith" autoComplete="name" />
        {errors.fullName && <p className={errorCls}>{errors.fullName.message}</p>}
      </div>

      <div>
        <label htmlFor="phone" className={labelCls}>Phone *</label>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <PatternFormat
              {...field}
              format="(###) ###-####"
              mask="_"
              placeholder="(817) 555-0123"
              className={inputCls}
              type="tel"
              id="phone"
              autoComplete="tel"
            />
          )}
        />
        {errors.phone && <p className={errorCls}>{errors.phone.message}</p>}
      </div>

      <div>
        <label htmlFor="applianceType" className={labelCls}>What needs repair? *</label>
        <select {...register('applianceType')} id="applianceType" className={inputCls} defaultValue="">
          <option value="" disabled>Choose the appliance…</option>
          {APPLIANCE_OPTIONS.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        {errors.applianceType && <p className={errorCls}>{errors.applianceType.message}</p>}
      </div>

      <button
        type="button"
        onClick={goToStep2}
        className="w-full text-white py-3 rounded-lg transition font-semibold text-base shadow-lg hover:shadow-xl"
        style={{ backgroundColor: '#1B2A4A' }}
      >
        Continue →
      </button>
    </div>
  );

  const step2Optional = short && (
    <>
      <div>
        <label htmlFor="message" className={labelCls}>Brand and problem (optional)</label>
        <textarea
          {...register('message')}
          id="message"
          rows={2}
          className={inputCls}
          placeholder="Samsung, not cooling"
        />
      </div>
      <div>
        <label htmlFor="email" className={labelCls}>E-mail (optional)</label>
        <input {...register('email')} type="email" id="email" className={inputCls} placeholder="john@example.com" autoComplete="email" inputMode="email" />
        {errors.email && <p className={errorCls}>{errors.email.message}</p>}
      </div>
    </>
  );

  const step2 = (
    <div key="step2" className="space-y-3">
      <div>
        <label htmlFor="street" className={labelCls}>Street address *</label>
        <input {...register('street')} type="text" id="street" className={inputCls} placeholder="123 Main Street" autoComplete="address-line1" />
        {errors.street && <p className={errorCls}>{errors.street.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="apartment" className={labelCls}>Unit / Apt</label>
          <input {...register('apartment')} type="text" id="apartment" className={inputCls} placeholder="Apt 4B" autoComplete="address-line2" />
        </div>
        <div>
          <label htmlFor="city" className={labelCls}>City *</label>
          <input {...register('city')} type="text" id="city" className={inputCls} placeholder="Your city" autoComplete="address-level2" />
          {errors.city && <p className={errorCls}>{errors.city.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="zipCode" className={labelCls}>ZIP code *</label>
        <Controller
          name="zipCode"
          control={control}
          render={({ field }) => (
            <PatternFormat
              {...field}
              format="#####"
              mask="_"
              placeholder="76102"
              className={inputCls}
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
            />
          )}
        />
        {errors.zipCode && <p className={errorCls}>{errors.zipCode.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="preferredDate" className={labelCls}>Preferred date *</label>
          <input
            {...register('preferredDate')}
            type="date"
            id="preferredDate"
            min={minDate || undefined}
            className={inputCls}
          />
          <p className="text-gray-500 text-xs mt-0.5">{bookingDaysHint(formType, market)}</p>
          {closures.map((label) => (
            <p key={label} className="text-amber-600 text-xs mt-0.5">No online booking {label}.</p>
          ))}
          {errors.preferredDate && <p className={errorCls}>{errors.preferredDate.message}</p>}
        </div>
        <div>
          <label htmlFor="preferredTimeSlot" className={labelCls}>Time slot *</label>
          <select
            {...register('preferredTimeSlot')}
            id="preferredTimeSlot"
            className={inputCls}
            defaultValue=""
          >
            <option value="" disabled>Select…</option>
            {TIME_SLOT_DEFS.map(({ label }) => {
              const status = slotStatus?.[label] ?? 'open';
              const suffix =
                status === 'full'
                  ? ' — fully booked'
                  : status === 'closed'
                    ? dayClosed || dayOff
                      ? ' — closed'
                      : ' — too late today'
                    : '';
              return (
                <option key={label} value={label} disabled={status !== 'open'}>
                  {label}{suffix}
                </option>
              );
            })}
          </select>
          {errors.preferredTimeSlot && <p className={errorCls}>{errors.preferredTimeSlot.message}</p>}
          {noSlotsLeft && !(dayOff && errors.preferredDate) && (
            <p className="text-gray-500 text-xs mt-0.5">
              {dayClosed
                ? `Online booking is closed ${dayClosed} — pick another day, or call us.`
                : dayOff
                  ? dayOff
                  : 'Nothing left for this day — pick the next one, or call us.'}
            </p>
          )}
        </div>
      </div>

      {step2Optional}

      <div className="grid grid-cols-3 gap-3 pt-1">
        <button
          type="button"
          onClick={goToStep1}
          className="col-span-1 py-3 rounded-lg font-semibold text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="col-span-2 text-white py-3 rounded-lg transition font-semibold text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#1B2A4A' }}
        >
          {isSubmitting ? 'Submitting…' : 'Request Service'}
        </button>
      </div>

      {submitStatus === 'error' && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
          Something went wrong. Please try again or call us directly.
        </div>
      )}

      {submitStatus === 'slot_full' && (
        <div className="bg-amber-100 border border-amber-400 text-amber-800 px-3 py-2 rounded text-sm">
          Sorry, this time slot is already fully booked for the selected date. Please pick another time slot or date.
        </div>
      )}

      {submitStatus === 'day_closed' && (
        <div className="bg-amber-100 border border-amber-400 text-amber-800 px-3 py-2 rounded text-sm">
          Online booking is closed for this date. Please pick another day, or call us.
        </div>
      )}

      {submitStatus === 'slot_closed' && (
        <div className="bg-amber-100 border border-amber-400 text-amber-800 px-3 py-2 rounded text-sm">
          That window has already started. Please pick a later one — or call us and we will find the
          fastest slot.
        </div>
      )}
    </div>
  );

  const formContent = (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      onInputCapture={() => {
        if (startedRef.current) return;
        startedRef.current = true;
        abTrack('form_start');
      }}
    >
      {/* Exposure = this visitor opened the appliance form (the tested element). */}
      {!isGym && <AbExposure id={FORM_TEST_ID} rendered={formVariant} />}
      {stepIndicator}
      {step === 1 ? (short ? step1Short : step1) : step2}
    </form>
  );

  if (variant === 'modal') {
    return formContent;
  }

  return (
    <section id="lead-form" className="py-12 bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="text-center mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              {step === 1 ? 'Request Service Today' : 'When should we come?'}
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              {step === 1
                ? "We'll call you back within 15 minutes"
                : 'Choose your address & preferred time'}
            </p>
          </div>
          {formContent}
        </div>
      </div>
    </section>
  );
}
