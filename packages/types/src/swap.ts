export interface TokenInfo {
  address: string;
  symbol: string;
  decimals: number;
  id: string;
}
export type TPairRoutePath = {
  token0: TokenInfo;
  token1: TokenInfo;
  token0Amount?: string;
  token1Amount?: string;
  address: string;
  feeRate: number;
};

export type TPairRoute = {
  feeRate: number;
  path: Array<TPairRoutePath>;
  rawPath: Array<TokenInfo>;
};

export type TSwapRecordItem = {
  tokenIn: TokenInfo;
  tokenOut: TokenInfo;
  valueIn: string;
  valueOut: string;
  tokenInReserve: string;
  tokenOutReserve: string;
};

export type TSwapRouteInfo = {
  route: TPairRoute;
  valueIn: string;
  valueOut: string;
  recordList: TSwapRecordItem[];
};

export interface PairToken {
  id: string;
  address: string;
  symbol: string;
  decimals: number;
  chainId: string;
}

export interface PairItem {
  token0: PairToken;
  token1: PairToken;
  originToken0: PairToken;
  originToken1: PairToken;

  price: number;
  priceUSD: number;
  pricePercentChange24h: number;
  priceHigh24h: number;
  priceHigh24hUSD: number;
  priceLow24h: number;
  priceLow24hUSD: number;
  volume24h: number; // // token0
  volumePercentChange24h: number;
  tvl: number;
  tvlPercentChange24h: number;
  valueLocked0: number;
  valueLocked1: number;
  tradeCount24h: number;
  tradeAddressCount24h: number;
  feePercent7d: number;
  feeRate: number;
  address: string;
  id: string;
  totalSupply: string;
  tradeValue24h: number; // token1
  priceChange24h: number;

  chainId: string;
  isFav: boolean;
  favId?: string | null;
}

export interface PoolItem extends PairItem {
  chainId: string;
}
