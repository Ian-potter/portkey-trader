import { Currency } from '@awaken/sdk-core';

export function isEqCurrency(c1?: Currency, c2?: Currency) {
  // return c1 && c2 && c1?.equals(c2);
  return c1 && c2 && c1.symbol === c2.symbol && c1.chainId === c2.chainId;
}
