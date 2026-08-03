// Indonesian localization helpers. See CLAUDE.md §9 / GIGA_PROMPT §6.

/** Indonesian tax constants. */
export const PPN_RATE = 0.11; // PPN 11%
export const PPH_FINAL_RATE = 0.005; // PPh Final 0.5% (PP 55/2022)
/** PPh Final 0.5% applies to UKMs with turnover below this annual threshold. */
export const PPH_FINAL_TURNOVER_CEILING = 4_800_000_000; // Rp 4,8 Miliar / tahun

const idrFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

/** Format a number as Indonesian Rupiah, e.g. 150000 -> "Rp 150.000". */
export function formatIDR(amount: number): string {
  // Intl renders "Rp150.000"; normalize to the "Rp 150.000" house style.
  return idrFormatter.format(amount).replace(/^Rp\s?/, 'Rp ');
}

/** Format a plain integer with Indonesian thousands separators (no currency symbol). */
export function formatNumberID(value: number): string {
  return new Intl.NumberFormat('id-ID').format(value);
}

/** PPN 11% on a pre-tax subtotal. */
export function calcPPN(subtotal: number): number {
  return Math.round(subtotal * PPN_RATE);
}

/** PPh Final 0.5% on gross revenue (only if under the UKM turnover ceiling). */
export function calcPPhFinal(grossRevenue: number): number {
  return Math.round(grossRevenue * PPH_FINAL_RATE);
}

/** Format an ISO date as Indonesian short form, e.g. "24 Okt 2023". */
export function formatDateID(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}
