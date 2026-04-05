/**
 * Calculates airtime value based on rate
 * @param amountPaid - money paid by customer
 * @param rate - rate of the day (e.g. 92 means 92%)
 */
export function calculateAirtime(amount: number, rate: number) {
  const numericAmount = Number(amount);
  const numericRate = Number(rate);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new Error("INVALID_AMOUNT");
  }

  if (!Number.isFinite(numericRate) || numericRate <= 0 || numericRate > 100) {
    throw new Error("INVALID_RATE");
  }

  return Math.floor((numericAmount * numericRate) / 100);
}
