import { TTokenItem } from '@/types';

const tokenWeights: { [key: string]: number } = {
  USDT: 100,
  USDC: 90,
  DAI: 80,
  ELF: 60,
  ETH: 50,
  BNB: 30,
};

export function getTokenWeights(symbol?: string): number {
  if (!symbol) return 0;
  return tokenWeights[symbol] || 1;
}

export function getPairsLogoOrderByTokenWeights(tokens: TTokenItem[]) {
  if (!tokens[0]?.symbol || !tokens[1]?.symbol) return tokens;

  return getTokenWeights(tokens[0]?.symbol) > getTokenWeights(tokens[1]?.symbol) ? tokens.reverse() : tokens;
}
