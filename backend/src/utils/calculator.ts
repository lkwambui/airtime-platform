/**
 * Calculates airtime value based on rate
 * @param amountPaid - money paid by customer
 * @param rate - rate of the day (e.g. 92 means 92%)
 */
export function calculateAirtime(amountPaid: number, rate: number): number {
  const airtime = (amountPaid * rate) / 100;
  return Number(airtime.toFixed(2));
}
