import {
  IPortkeySwapperAdapter,
  SwapperError,
  TCheckBestRouter,
  TSwapperForExactTokens,
  TSwapperForTokens,
  TSwapperName,
} from '../types';
import {
  AwakenService,
  BestSwapRoutesAmountInParams,
  BestSwapRoutesAmountOutParams,
  IAwakenService,
  IBestSwapRoutes,
  RouteType,
} from '@portkey/trader-services';

import { FetchRequest } from '@portkey/request';
import { IBaseRequest } from '@portkey/types';
import { IAwakenSwapperConfig } from './types';
import { SwapperConfig } from '../config';
import { getContractBasic } from '@portkey/contracts';
import { aelf } from '@portkey/utils';
import { COMMON_PRIVATE, DEFAULT_CID } from '../constants';
import { handleErrorMessage } from '@portkey/trader-utils';
import { getDeadline } from '../utils';

export const AwakenName = 'Awaken' as TSwapperName<'Awaken'>;

export class AwakenSwapper implements IPortkeySwapperAdapter {
  public name = AwakenName;
  public services: IAwakenService;
  public fetchRequest: IBaseRequest;
  public config: SwapperConfig;
  public contractConfig: IAwakenSwapperConfig['contractConfig'];

  constructor(config: IAwakenSwapperConfig) {
    this.config = new SwapperConfig(config);
    this.contractConfig = config.contractConfig;
    this.refreshServices();
  }
  public async getBestRouters(
    routeType: RouteType.AmountIn,
    params: Omit<BestSwapRoutesAmountInParams, 'routeType'>,
  ): Promise<IBestSwapRoutes>;
  public async getBestRouters(
    routeType: RouteType.AmountOut,
    params: Omit<BestSwapRoutesAmountOutParams, 'routeType'>,
  ): Promise<IBestSwapRoutes>;
  public async getBestRouters(
    routeType: RouteType,
    params: Omit<BestSwapRoutesAmountInParams, 'routeType'> | Omit<BestSwapRoutesAmountOutParams, 'routeType'>,
  ): Promise<IBestSwapRoutes> {
    const result = await this.services.fetchBestSwapRoutes({ ...params, routeType } as any);
    if (result.code !== '20000') throw result.message;
    if (!result.data.routes?.length) throw SwapperError.noSupportTradePair;
    return result.data;
  }

  getAuthToken(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  setConfig(options: IAwakenSwapperConfig) {
    if (options.contractConfig) this.contractConfig = options.contractConfig;
    this.config.setConfig(options);
  }

  refreshServices() {
    this.fetchRequest = new FetchRequest(this.config.requestConfig);
    this.services = new AwakenService(this.fetchRequest);
  }
  swap(params: TSwapperForExactTokens): Promise<any>;
  swap(params: TSwapperForTokens): Promise<any>;
  async swap({
    routeType,
    amountIn,
    amountInMax,
    contractOption,
    feeRates,
    amountOut,
    amountOutMin,
    path,
    to,
    deadline: _deadline,
    channel = DEFAULT_CID,
  }): Promise<any> {
    // SwapExactTokensForTokens SwapTokensForExactTokens
    const methodName = routeType === RouteType.AmountIn ? 'SwapExactTokensForTokens' : 'SwapTokensForExactTokens';
    const deadline = _deadline ?? getDeadline();

    const args = routeType === RouteType.AmountIn ? { amountIn, amountOutMin } : { amountOut, amountInMax };

    const contract = await getContractBasic({
      contractAddress: this.contractConfig.contractAddress,
      rpcUrl: this.contractConfig.rpcUrl,
      ...contractOption,
    } as any);

    const result = await contract.callSendMethod(methodName, '', {
      swapTokens: [
        {
          feeRates,
          path,
          to,
          deadline,
          channel,
          ...args,
        },
      ],
    });

    console.log(result, 'result==swap');
  }

  public async checkBestRouters({
    routeType,

    feeRates,
    path,
    amount,
  }: TCheckBestRouter): Promise<any> {
    const methodName = routeType === RouteType.AmountIn ? 'GetAmountsOut' : 'GetAmountsIn';
    const amountKey = routeType === RouteType.AmountIn ? 'amountIn' : 'amountOut';
    const contract = await getContractBasic({
      contractAddress: this.contractConfig.contractAddress,
      rpcUrl: this.contractConfig.rpcUrl,
      account: aelf.getWallet(COMMON_PRIVATE),
    });

    const result = await contract.callViewMethod(methodName, {
      [amountKey]: amount,
      feeRates,
      path,
    });
    if (result.error) throw handleErrorMessage(result.error);
    console.log(result, 'result===checkBestRouters');
    return result;
  }

  // async checkBestRouters({
  //   routeType,

  //   feeRates,
  //   path,
  //   amount,

  //   contractOption,
  // }: TCheckBestRouter): Promise<any> {
  //   const methodName = routeType === RouteType.AmountIn ? 'GetAmountsOut' : 'GetAmountsIn';
  //   const amountKey = routeType === RouteType.AmountIn ? 'amountIn' : 'amountOut';
  //   const contract = await getContractBasic({
  //     contractAddress: this.contractConfig.contractAddress,
  //     ...contractOption,
  //   } as any);

  //   const result = await contract.callViewMethod(methodName, {
  //     [amountKey]: amount,
  //     feeRates,
  //     path,
  //   });
  //   console.log(result, 'result===checkBestRouters');
  //   return result;
  // }
}
