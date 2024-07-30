import BigNumber from 'bignumber.js';
import { DEFAULT_SLIPPAGE_TOLERANCE } from '../constants';
import { ONE } from '../constants/misc';

export function minimumAmountOut(outputAmount: BigNumber, slippageTolerance = DEFAULT_SLIPPAGE_TOLERANCE) {
  if (slippageTolerance === '') slippageTolerance = DEFAULT_SLIPPAGE_TOLERANCE;
  return outputAmount.times(ONE.div(ONE.plus(slippageTolerance)));
}

export function maxAmountIn(inputAmount: BigNumber, slippageTolerance = DEFAULT_SLIPPAGE_TOLERANCE) {
  if (slippageTolerance === '') slippageTolerance = DEFAULT_SLIPPAGE_TOLERANCE;
  return inputAmount.times(ONE.div(ONE.minus(slippageTolerance)));
}
