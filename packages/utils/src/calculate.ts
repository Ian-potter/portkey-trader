import BigNumber from 'bignumber.js';
import { ZERO, VALUE_B, VALUE_M, VALUE_T, ONE } from './constants/misc';
export function timesDecimals(a?: BigNumber.Value, decimals?: string | number) {
  if (!a) return ZERO;
  const bigA = BigNumber.isBigNumber(a) ? a : new BigNumber(a || '');
  if (bigA.isNaN()) return ZERO;
  if (typeof decimals === 'string' && decimals.length > 10) {
    return bigA.times(decimals);
  }
  return bigA.times(`1e${decimals ?? 18}`);
}
export function divDecimals(a?: BigNumber.Value, decimals?: string | number) {
  if (!a) return ZERO;
  const bigA = BigNumber.isBigNumber(a) ? a : new BigNumber(a || '');
  if (bigA.isNaN()) return ZERO;
  if (typeof decimals === 'string' && decimals.length > 10) {
    return bigA.div(decimals);
  }

  return bigA.div(`1e${decimals ?? 18}`);
}

export function bigNumberToWeb3Input(input: BigNumber): string {
  return BigNumber.isBigNumber(input) ? input.toFixed(0) : new BigNumber(input).toFixed(0);
}
export function valueToPercentage(input?: BigNumber.Value) {
  return BigNumber.isBigNumber(input) ? input.times(100) : timesDecimals(input, 2);
}

export function valueToUSD(input: BigNumber.Value): BigNumber.Value {
  if (!BigNumber.isBigNumber) {
    throw new Error('input not is number');
  }
  const bgInput = new BigNumber(input);
  if (bgInput.gte(VALUE_T)) {
    return bgInput.div(VALUE_T).toFormat(2);
  }
  if (bgInput.gte(VALUE_B)) {
    return bgInput.div(VALUE_B).toFormat(2);
  }
  if (bgInput.gte(VALUE_M)) {
    return bgInput.div(VALUE_M).toFormat(2);
  }

  return bgInput.toFormat(2);
}

export type TGetRealPriceParams = {
  side?: number;
  token0Amount?: string | number;
  token1Amount?: string | number;
  feeRate?: string | number;
};
export const getRealPrice = ({ side, token0Amount = 0, token1Amount = 0, feeRate = 0 }: TGetRealPriceParams) => {
  const average = ZERO.plus(token1Amount).div(token0Amount);
  if (side === 0) {
    return average.multipliedBy(ONE.minus(feeRate)).toFixed();
  } else {
    return average.div(ONE.minus(feeRate)).toFixed();
  }
};

export type TGetRealPriceWithDexFeeParams = {
  side?: number;
  token0Amount?: string | number;
  token1Amount?: string | number;
  dexFee?: string | number;
};
export const getRealPriceWithDexFee = ({
  side,
  token0Amount = 0,
  token1Amount = 0,
  dexFee = 0,
}: TGetRealPriceWithDexFeeParams) => {
  if (side === 0) {
    return ZERO.plus(token1Amount).minus(dexFee).div(token0Amount);
  } else if (side === 1) {
    return ZERO.plus(token1Amount).div(ZERO.plus(token0Amount).minus(dexFee));
  } else {
    return ZERO.plus(token0Amount).minus(dexFee).div(token1Amount);
  }
};

export const getRealReceivePriceWithDexFee = ({
  side,
  token0Amount = 0,
  token1Amount = 0,
  dexFee = 0,
}: TGetRealPriceWithDexFeeParams) => {
  if (side === 0) {
    return ZERO.plus(token1Amount).minus(dexFee).div(token0Amount);
  } else {
    return ZERO.plus(token0Amount).minus(dexFee).div(token1Amount);
  }
};

export type TGetRealToken0AmountParams = {
  side?: number;
  value?: string | number;
  feeRate?: string | number;
  decimals?: number;
};
export const getRealToken0Amount = ({ side, value = 0, feeRate = 0, decimals = 8 }: TGetRealToken0AmountParams) => {
  return side === 0 ? value : ZERO.plus(value).multipliedBy(ONE.minus(feeRate)).dp(decimals).toFixed();
};

export type TGetRealToken1AmountParams = {
  side?: number;
  value?: string | number;
  feeRate?: string | number;
  decimals?: number;
};
export const getRealToken1Amount = ({ side, value = 0, feeRate = 0, decimals = 8 }: TGetRealToken1AmountParams) => {
  return side === 1 ? value : ZERO.plus(value).multipliedBy(ONE.minus(feeRate)).dp(decimals).toFixed();
};
