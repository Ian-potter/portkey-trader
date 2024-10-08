import BigNumber from 'bignumber.js';

export const ZERO = new BigNumber(0);
export const ONE = new BigNumber(1);

export const DIGIT_CODE = {
  // digit code expiration time (minutes)
  expiration: 10,
  // digit code length
  length: 6,
};

export const PASSWORD_LENGTH = 6;

export const LANG_MAX = new BigNumber('9223372036854774784');
export const LP_DECIMALS = 8;
export const LANG_MAX_VALUE = LANG_MAX.toFixed();

export const TOKEN_SORT_MAP: Record<string, string> = {
  ELF: LANG_MAX.toFixed(),
  USDT: LANG_MAX.minus(1).toFixed(),
};

export const isEffectiveNumber = (v: any) => {
  const val = new BigNumber(v);
  return !val.isNaN() && !val.lte(0);
};
export const SWAP_TIME_INTERVAL = 30 * 1000;
