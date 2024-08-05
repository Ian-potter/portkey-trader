import { ONE, ZERO, valueToPercentage } from '@portkey/trader-utils';
import { DEFAULT_SLIPPAGE_TOLERANCE } from '../constants/swap';
import BigNumber from 'bignumber.js';

export function parseUserSlippageTolerance(input?: string) {
  return valueToPercentage(input || DEFAULT_SLIPPAGE_TOLERANCE);
}

export function bigNumberToString(big: BigNumber, decimals?: number) {
  return big.isNaN() ? '0' : big.dp(decimals ?? 18).toString();
}

export function minimumAmountOut(outputAmount: BigNumber, slippageTolerance = DEFAULT_SLIPPAGE_TOLERANCE) {
  if (slippageTolerance === '') slippageTolerance = DEFAULT_SLIPPAGE_TOLERANCE;
  return outputAmount.times(ONE.div(ONE.plus(slippageTolerance)));
}

export const getPriceImpactWithBuy = (
  reserveA: BigNumber,
  reserveB: BigNumber,
  total: BigNumber | string,
  output: BigNumber,
): BigNumber => {
  if (!reserveA || !reserveB || !total) return ZERO;

  const prePro = reserveB.div(reserveA);

  const bigTotal = new BigNumber(total);
  const numerator = reserveB.plus(bigTotal);
  const denominator = reserveA.minus(output);

  return numerator.div(denominator).minus(prePro).div(prePro).times(100);
};
