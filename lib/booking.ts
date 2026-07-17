// Booking time slots + online booking capacity.
// A slot on a given date closes for online booking once MAX_BOOKINGS_PER_SLOT
// leads have been submitted for it (phone bookings are not counted).
export const TIME_SLOTS = ['9 AM – 12 PM', '12 PM – 3 PM', '3 PM – 6 PM'] as const;

export const MAX_BOOKINGS_PER_SLOT = 2;

export type TimeSlot = (typeof TIME_SLOTS)[number];
