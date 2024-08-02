export type PBTimestamp = {
  seconds: number;
  nanos: number;
};
export interface TokenInfo {
  address: string;
  symbol: string;
  decimals: number;
  id: string;
}
export type TTradePair = {
  chainId: string;
  address: string;
  feeRate: number;
  isTokenReversed: boolean;
  token0: TokenInfo;
  token1: TokenInfo;
  id: string;
};
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

export type TTradePairExtension = {
  valueLocked0: string;
  valueLocked1: string;
};

export type TSwapRouteDistribution = {
  percent: number;
  amountIn: string;
  amountOut: string;
  tradePairs: TTradePair[];
  tradePairExtensions: TTradePairExtension[];
  tokens: TokenInfo[];
  amounts: string[];
  feeRates: number[];
};
export type TSwapRoute = {
  amountIn: string;
  amountOut: string;
  splits: number;
  distributions: TSwapRouteDistribution[];
};

export type TContractSwapToken = {
  amountIn: string;
  amountOutMin: string;
  channel: string;
  deadline: number | PBTimestamp;
  path: string[];
  to: string;
  feeRates: number[];
};

export enum StatusCodeEnum {
  Success = 1000,
  InsufficientLiquidity = 2000,
  NoRouteFound = 2001,
}

export type TPercentInfoRoute = {
  pairAddress: string;
  tradePair: TTradePair;
  amountOut: string;
  amountIn: string;
  totalFee: string;
  symbolOut: string;
  symbolIn: string;
  channel: string;
};
export type TPercentInfo = {
  percent: string;
  route: TPercentInfoRoute[];
};
