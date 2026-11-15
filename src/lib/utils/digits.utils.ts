const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** Codes must be stored as ASCII digits so server-side verification never sees locale digits. */
export function toEnglishDigits(input: string): string {
  return input.replace(/[۰-۹٠-٩]/g, (character) => {
    const persianIndex = PERSIAN_DIGITS.indexOf(character);
    const index = persianIndex === -1 ? ARABIC_DIGITS.indexOf(character) : persianIndex;
    return String(index);
  });
}

/** Used for text and aria-labels so numbering matches the Persian UI. */
export function toPersianDigits(input: string): string {
  return input.replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[Number(digit)] ?? digit);
}
