import { ICAInstanceOptions, IEOAInstanceOptions, IProviderOptions } from '@portkey/contracts';
import {
  BestSwapRoutesAmountInParams,
  BestSwapRoutesAmountOutParams,
  FetchTokenListParams,
  IBestSwapRoutes,
  IToken,
  RouteType,
} from '@portkey/trader-services';
import { PBTimestamp } from '@portkey/trader-types';
import { IRequestDefaults, IStorageSuite } from '@portkey/types';

export type TSwapperName<T extends string = string> = T & { __brand__: 'SwapperName' };

export type TContractOption =
  | Omit<IProviderOptions, 'contractAddress' | 'rpcUrl'>
  | Omit<IEOAInstanceOptions, 'contractAddress' | 'rpcUrl'>
  | Omit<ICAInstanceOptions, 'contractAddress' | 'rpcUrl'>;

export type TSwapToken = {
  feeRates: number[];
  path: string[];
  amount: string;
};

export type TCheckBestRouter = {
  routeType: RouteType;
  swapTokens: TSwapToken[];
};

export type TBaseSwapperParams = {
  contractOption: TContractOption;

  bestSwapTokensInfo: TBestRoutersAmountInfo;

  toAddress?: string;
  userAddress: string;
  slippageTolerance?: string;
  deadline?: PBTimestamp;
  channel?: string;
};

// export type TSwapperForTokens = {
//   routeType: RouteType.AmountIn;
//   amountIn: number | string;
//   amountOut: number | string;
// } & TBaseSwapperParams;

// export type TSwapperForExactTokens = {
//   routeType: RouteType.AmountOut;
//   amountIn: number | string;
//   amountOut: number | string;
// } & TBaseSwapperParams;

export type TSwapperParams = {
  routeType: RouteType;
  amountIn?: string | number;
  amountOut?: string | number;
  symbol: string;
  tokenApprove?: (params: {
    spender: string;
    symbol: string;
    amount: string | number;
  }) => Promise<{ error?: any } | void | undefined>;
} & TBaseSwapperParams;

export type TSlippageTolerance = {
  slippageTolerance?: string;
};
export type TGetBestRoutersAmountInParams = Omit<BestSwapRoutesAmountInParams, 'routeType'> & TSlippageTolerance;

export type TGetBestRoutersAmountOutParams = Omit<BestSwapRoutesAmountOutParams, 'routeType'> & TSlippageTolerance;

export type TBestRoutersResult = {
  bestRouters: IBestSwapRoutes['routes'];
  swapTokens: TSwapToken[];
};
export type TBestRoutersAmountInfo = {
  swapTokens: (Omit<TSwapToken, 'amount'> & { amountIn: string; amountOut: string })[];
  allAmount: string;
};
export interface IPortkeySwapperAdapter<Name extends string = string> {
  name: TSwapperName<Name>;
  getBestRouters(routeType: RouteType.AmountIn, params: TGetBestRoutersAmountInParams): Promise<TBestRoutersResult>;
  getBestRouters(routeType: RouteType.AmountOut, params: TGetBestRoutersAmountOutParams): Promise<TBestRoutersResult>;

  getAuthToken(): Promise<any>;
  checkBestRouters(params: TCheckBestRouter): Promise<TBestRoutersAmountInfo>;
  swap(params: TSwapperParams): Promise<any>;
  getSupportTokenList(params: FetchTokenListParams): Promise<IToken[]>;
}

export interface ISwapperBaseConfig {
  requestDefaults?: IRequestDefaults;
  graphQLUrl?: string;
  storageMethod?: IStorageSuite;
  /** Get the service url of user jwt token  */
  connectUrl?: string;
}

export interface ISwapperConfig extends ISwapperBaseConfig {
  setConfig(options: ISwapperBaseConfig): void;
}

export enum SwapperError {
  noSupportTradePair = 'The current transaction is not supported.',
  insufficientLiquidity = 'The transaction is insufficient in liquidity.',
  outPutError = 'Insufficient Output amount, please Re-enter exchange',
}
