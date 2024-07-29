import { ICAInstanceOptions, IEOAInstanceOptions, IProviderOptions } from '@portkey/contracts';
import {
  BestSwapRoutesAmountInParams,
  BestSwapRoutesAmountOutParams,
  IBestSwapRoutes,
  RouteType,
} from '@portkey/trader-services';
import { PBTimestamp } from '@portkey/trader-types';
import { IRequestDefaults, IStorageSuite } from '@portkey/types';

export type TSwapperName<T extends string = string> = T & { __brand__: 'SwapperName' };

export type TContractOption =
  | Omit<IProviderOptions, 'contractAddress' | 'rpcUrl'>
  | Omit<IEOAInstanceOptions, 'contractAddress' | 'rpcUrl'>
  | Omit<ICAInstanceOptions, 'contractAddress' | 'rpcUrl'>;

export type TCheckBestRouter = {
  routeType: RouteType;
  feeRates: number[];
  path: string[];
  amount: number | string;
};

export type TBaseSwapperParams = {
  contractOption: TContractOption;

  path: string[];

  to: string;
  feeRates: number[];

  deadline?: PBTimestamp;
  channel?: string;
};

export type TSwapperForTokens = {
  routeType: RouteType.AmountIn;
  amountIn: number | string;
  amountOutMin: number | string;
} & TBaseSwapperParams;

export type TSwapperForExactTokens = {
  routeType: RouteType.AmountOut;
  amountInMax: number | string;
  amountOut: number | string;
} & TBaseSwapperParams;

export type TGetBestRoutersParams = BestSwapRoutesAmountInParams | BestSwapRoutesAmountOutParams;

export interface IPortkeySwapperAdapter<Name extends string = string> {
  name: TSwapperName<Name>;
  getBestRouters(
    routeType: RouteType.AmountIn,
    params: Omit<BestSwapRoutesAmountInParams, 'routeType'>,
  ): Promise<IBestSwapRoutes>;
  getBestRouters(
    routeType: RouteType.AmountOut,
    params: Omit<BestSwapRoutesAmountOutParams, 'routeType'>,
  ): Promise<IBestSwapRoutes>;
  // getBestRouters(params: Required<BestSwapRoutesAmountOutParams>): Promise<IBestSwapRoutes>;
  // getBestRouters(params: TGetBestRoutersParams): Promise<IBestSwapRoutes>;

  getAuthToken(): Promise<any>;
  checkBestRouters(params: TCheckBestRouter): Promise<any>;
  swap(params: TSwapperForExactTokens): Promise<any>;
  swap(params: TSwapperForTokens): Promise<any>;
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
  noSupportTradePair = 'The current transaction is not supported',
}
