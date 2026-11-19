// Shared values for the user-management screens.
// Imported by both the browser and the server, so it must stay dependency free.

export const USERS_PAGE_SIZE = 20;
export const BAN_REASON_MAX_LENGTH = 200;

// Values are exactly what the ban form submits, so the dialog and the schema
// can never drift apart.
export const BAN_DURATIONS = ["permanent", "86400", "604800", "2592000"] as const;

export type BanDuration = (typeof BAN_DURATIONS)[number];

export const BAN_DURATION_OPTIONS: { value: BanDuration; label: string }[] = [
  { value: "permanent", label: "دائمی" },
  { value: "86400", label: "یک روز" },
  { value: "604800", label: "هفت روز" },
  { value: "2592000", label: "سی روز" },
];

// Seconds handed to Better Auth. A permanent ban has no expiry at all.
export const BAN_DURATION_SECONDS: Record<
  Exclude<BanDuration, "permanent">,
  number
> = {
  "86400": 86400,
  "604800": 604800,
  "2592000": 2592000,
};
