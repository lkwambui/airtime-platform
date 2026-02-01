/**
 * Calculates airtime value based on rate
 * @param amountPaid - money paid by customer
 * @param rate - rate of the day (e.g. 92 means 92%)
 */
export function calculateAirtime(amount: number, rate: number) {
  return Number((amount / (rate / 100)).toFixed(2));
}
