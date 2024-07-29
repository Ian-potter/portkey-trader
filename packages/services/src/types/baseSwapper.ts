import { ChainId } from '@portkey/types';

export enum RouteType {
  AmountIn = 0,
  AmountOut = 1,
}
export type BestSwapRoutesParams = {
  chainId: ChainId;
  symbolIn: string;
  symbolOut: string;
};

export type BestSwapRoutesAmountInParams = BestSwapRoutesParams & {
  amountIn: string | number;
  routeType: RouteType.AmountIn;
};

export type BestSwapRoutesAmountOutParams = BestSwapRoutesParams & {
  amountOut: string | number;
  routeType: RouteType.AmountOut;
};

export interface IToken {
  address: string;
  symbol: string;
  decimals: number;
  chainId: string;
  id: string;
}

export interface ITradePair {
  chainId: string;
  address: string;
  feeRate: number;
  isTokenReversed: boolean;
  token0: IToken;
  token1: IToken;
  id: string;
}

export interface IDistribution {
  percent: number;
  amountIn: number;
  amountOut: number;
  tradePairs: ITradePair[];
  tokens: IToken[];
  amounts: number[];
  feeRates: number[];
}

export interface IRoute {
  amountIn: number;
  amountOut: number;
  splits: number;
  distributions: IDistribution[];
}

export interface IBestSwapRoutes {
  routes: IRoute[];
}

export interface IApiResponse<T = any> {
  code: string;
  data: T;
  message: string;
}
