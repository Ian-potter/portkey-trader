import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { divDecimals } from '@portkey/trader-utils';
import { TOKEN_SORT_MAP, ZERO } from '../../../constants/misc';
import { Token } from '@/types';

// compare two token amounts with highest one coming first
function balanceComparator(balanceA?: BigNumber, balanceB?: BigNumber) {
  if (balanceA && balanceB) {
    return balanceA.gt(balanceB) ? -1 : balanceA.eq(balanceB) ? 0 : 1;
  } else if (balanceA && balanceA.gt('0')) {
    return -1;
  } else if (balanceB && balanceB.gt('0')) {
    return 1;
  }
  return 0;
}
function getTokenComparator(balances: {
  [tokenAddress: string]: BigNumber | undefined;
}): (tokenA: Token, tokenB: Token) => number {
  return function sortTokens(tokenA: Token, tokenB: Token): number {
    // -1 = a is first
    // 1 = b is first

    // sort by balances
    const valueA = balances[tokenA.address] || ZERO;
    const balanceA =
      valueA.isNaN() || TOKEN_SORT_MAP[tokenA.symbol]
        ? ZERO.plus(TOKEN_SORT_MAP[tokenA.symbol] || 0)
        : divDecimals(valueA, tokenA.decimals);
    const valueB = balances[tokenB.address] || ZERO;
    const balanceB =
      valueB.isNaN() || TOKEN_SORT_MAP[tokenB.symbol]
        ? ZERO.plus(TOKEN_SORT_MAP[tokenB.symbol] || 0)
        : divDecimals(valueB, tokenB.decimals);
    const balanceComp = balanceComparator(balanceA, balanceB);
    if (balanceComp !== 0) return balanceComp;

    if (tokenA.symbol && tokenB.symbol) {
      // sort by symbol
      return tokenA.symbol.toLowerCase() < tokenB.symbol.toLowerCase() ? -1 : 1;
    } else {
      return tokenA.symbol ? -1 : tokenB.symbol ? -1 : 0;
    }
  };
}

export function useTokenComparator(
  inverted: boolean,
  balances: {
    [tokenAddress: string]: BigNumber;
  },
): (tokenA: Token, tokenB: Token) => number {
  const comparator = useMemo(() => getTokenComparator(balances ?? {}), [balances]);
  return useMemo(() => {
    if (inverted) {
      return (tokenA: Token, tokenB: Token) => comparator(tokenA, tokenB) * -1;
    } else {
      return comparator;
    }
  }, [inverted, comparator]);
}
