import {
  IPortkeySwapperAdapter,
  SwapperError,
  TBestRoutersAmountInfo,
  TBestRoutersResult,
  TCheckBestRouter,
  TContractOption,
  TGetBestRoutersAmountInParams,
  TGetBestRoutersAmountOutParams,
  TSwapperName,
  TSwapperParams,
  TTokenApproveHandler,
} from '../types';
import {
  AwakenService,
  FetchTokenListParams,
  IAwakenService,
  IFetchTokenPriceParams,
  IFetchTransactionFeeResult,
  IToken,
  RouteType,
} from '@portkey/trader-services';

import { FetchRequest } from '@portkey/request';
import { IBaseRequest } from '@portkey/types';
import { IAwakenSwapperConfig } from './types';
import { SwapperConfig } from '../config';
import { getContractBasic } from '@portkey/contracts';
import { aelf } from '@portkey/utils';
import { COMMON_PRIVATE, DEFAULT_CID } from '../constants';
import { getTokenContractAddress, handleErrorMessage } from '@portkey/trader-utils';
import { getDeadline } from '../utils';
import { maxAmountIn, minimumAmountOut } from '../utils/awaken';
import { ONE, TEN_THOUSAND, ZERO } from '../constants/misc';

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
    params: TGetBestRoutersAmountInParams,
  ): Promise<TBestRoutersResult>;
  public async getBestRouters(
    routeType: RouteType.AmountOut,
    params: TGetBestRoutersAmountOutParams,
  ): Promise<TBestRoutersResult>;
  public async getBestRouters(
    routeType: RouteType,
    params: TGetBestRoutersAmountInParams | TGetBestRoutersAmountOutParams,
  ): Promise<TBestRoutersResult> {
    const result = await this.services.fetchBestSwapRoutes({ ...params, routeType } as any);
    if (result.code !== '20000') throw result.message;
    const bestRouters = result.data?.routes;
    if (result.data.statusCode === 2000) throw SwapperError.insufficientLiquidity;
    if (result.data.statusCode === 2001) throw SwapperError.noSupportTradePair;
    if (!bestRouters?.length) throw SwapperError.noSupportTradePair;
    const swapTokens = bestRouters[0].distributions.map(item => {
      const path = item.tokens.map(item => item.symbol);
      const amount = routeType === RouteType.AmountIn ? item.amountIn : item.amountOut;

      return {
        feeRates: item.feeRates.map(item => TEN_THOUSAND.times(item).toNumber()),
        path,
        amount,
      };
    });
    return { bestRouters: bestRouters, swapTokens };
  }

  getAuthToken(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  setConfig(options: IAwakenSwapperConfig) {
    if (options.contractConfig) this.contractConfig = options.contractConfig;
    this.config.setConfig(options);
  }

  async getSupportTokenList(params: FetchTokenListParams): Promise<IToken[]> {
    const result = await this.services.getSupportTokenList(params);
    if (result.code !== '20000') throw result.message;
    const data = result.data;
    const tokenMap: { [x in string]: IToken } = {};
    [...data.token0, ...data.token1].forEach(item => {
      if (tokenMap[item.symbol]) return;
      tokenMap[item.symbol] = item;
    });
    return Object.values(tokenMap);
  }

  async getTokenPrice(params: IFetchTokenPriceParams): Promise<string> {
    const result = await this.services.getTokenPrice(params);
    if (result.code !== '20000') throw result.message;
    return result.data;
  }

  async getTransactionFee(): Promise<IFetchTransactionFeeResult> {
    const result = await this.services.getTransactionFee();
    if (result.code !== '20000') throw result.message;
    return result.data;
  }

  refreshServices() {
    this.fetchRequest = new FetchRequest(this.config.requestConfig);
    this.services = new AwakenService(this.fetchRequest);
  }

  async checkAllowanceAndApprove({
    symbol,
    owner,
    amount,
    tokenApprove,
    contractOption,
  }: {
    symbol: string;
    owner: string;
    amount: number | string;
    contractOption: TContractOption;
    tokenApprove?: TTokenApproveHandler;
  }) {
    const tokenAddress = await getTokenContractAddress(this.contractConfig.rpcUrl);
    const tokenContract = await this.getContract({
      rpcUrl: this.contractConfig.rpcUrl,
      contractAddress: tokenAddress,
      contractOption,
    });

    const allowanceRes = await tokenContract.callViewMethod('GetAvailableAllowance', {
      symbol,
      owner,
      spender: this.contractConfig.swapContractAddress,
    });

    if (allowanceRes.error) {
      throw allowanceRes.error;
    }
    let allowanceResult = 0;
    if (allowanceRes.data.allowance != undefined) {
      allowanceResult = allowanceRes.data.allowance;
    } else {
      allowanceResult = allowanceRes.data.amount || 0;
    }

    if (ZERO.plus(allowanceResult).lt(amount)) {
      const approveParams = {
        spender: this.contractConfig.swapContractAddress,
        symbol,
        amount,
      };
      if (tokenApprove) {
        const approveRes = await tokenApprove(approveParams);
        if (approveRes?.error) throw approveRes.error;
      } else {
        const result = await tokenContract.callSendMethod('Approve', '', approveParams);
        if (result.error) throw result.error;
      }
    }
  }

  async getBalance({
    symbol,
    owner,
    contractOption,
  }: {
    symbol: string;
    owner: string;
    contractOption: TContractOption;
  }) {
    const tokenAddress = await getTokenContractAddress(this.contractConfig.rpcUrl);
    const tokenContract = await this.getContract({
      rpcUrl: this.contractConfig.rpcUrl,
      contractAddress: tokenAddress,
      contractOption,
    });

    const balanceRes = await tokenContract.callViewMethod('GetBalance', {
      symbol,
      owner,
    });

    if (balanceRes.error) {
      throw balanceRes.error;
    }
    return balanceRes.data;
  }

  getContract({
    contractOption,
    contractAddress,
    rpcUrl,
  }: {
    contractOption: TContractOption;
    contractAddress: string;
    rpcUrl: string;
  }) {
    const contractParams: any = {
      ...contractOption,
      contractAddress,
      rpcUrl,
    };
    if ('aelfInstance' in contractParams && contractParams['aelfInstance']) delete contractParams.rpcUrl;
    return getContractBasic(contractParams);
  }

  async swap({
    routeType,
    contractOption,
    amountIn,
    symbol,
    bestSwapTokensInfo,
    slippageTolerance,
    toAddress,
    deadline: _deadline,
    channel = DEFAULT_CID,
    userAddress,
    tokenApprove,
  }: TSwapperParams): Promise<any> {
    let methodName: 'SwapExactTokensForTokens' | 'SwapTokensForExactTokens';
    let needApproveAmount;
    let needApproveKey: 'amountIn' | 'amountOut';
    switch (routeType) {
      case RouteType.AmountIn:
        methodName = 'SwapExactTokensForTokens';
        needApproveAmount = amountIn;
        needApproveKey = 'amountIn';
        break;
      case RouteType.AmountOut:
      default:
        methodName = 'SwapTokensForExactTokens';
        needApproveAmount = amountIn;
        needApproveKey = 'amountOut';
        break;
    }
    if (!needApproveAmount) throw `Please set ${needApproveKey}`;
    await this.checkAllowanceAndApprove({
      symbol,
      owner: userAddress,
      tokenApprove,
      amount: needApproveAmount,
      contractOption,
    });

    const getAmount = (amountIn: string, amountOut: string) =>
      routeType === RouteType.AmountIn
        ? {
            amountIn,
            amountOutMin: minimumAmountOut(ONE.plus(amountOut), slippageTolerance).toFixed(0),
          }
        : { amountOut, amountInMax: maxAmountIn(ONE.plus(amountIn), slippageTolerance).toFixed(0) };

    const deadline = _deadline ?? getDeadline();
    const swapTokens = bestSwapTokensInfo.swapTokens.map(item => ({
      feeRates: item.feeRates,
      path: item.path,
      to: toAddress ?? userAddress,
      deadline,
      channel,
      ...getAmount(item.amountIn, item.amountOut),
    }));

    console.log(swapTokens, 'swapTokens===');
    const contract = await this.getContract({
      contractAddress: this.contractConfig.swapContractAddress,
      rpcUrl: this.contractConfig.rpcUrl,
      contractOption,
    });

    const result = await contract.callSendMethod(methodName, '', {
      swapTokens,
    });
    if (result.error) {
      const errorMessage = handleErrorMessage(result.error, 'Swap error');
      if (errorMessage.includes(SwapperError.outPutError)) throw SwapperError.outPutError;
      throw errorMessage;
    }
    console.log(result, 'result==swap');
    return result.data;
  }

  public async checkBestRouters({ swapTokens, routeType }: TCheckBestRouter): Promise<TBestRoutersAmountInfo> {
    let methodName: 'GetAmountsOut' | 'GetAmountsIn' = 'GetAmountsOut';
    let amountInputKey: 'amountIn' | 'amountOut' = 'amountIn';
    let amountResultKey: 'amountOut' | 'amountIn' = 'amountOut';

    switch (routeType) {
      case RouteType.AmountIn:
        methodName = 'GetAmountsOut';
        amountInputKey = 'amountIn';
        amountResultKey = 'amountOut';
        break;
      case RouteType.AmountOut:
      default:
        methodName = 'GetAmountsIn';
        amountInputKey = 'amountOut';
        amountResultKey = 'amountIn';
    }

    const contract = await getContractBasic({
      contractAddress: this.contractConfig.swapContractAddress,
      rpcUrl: this.contractConfig.rpcUrl,
      account: aelf.getWallet(COMMON_PRIVATE),
    });

    // console.log(feeRates, 'feeRates===');
    const results = await Promise.all(
      swapTokens.map(item =>
        contract.callViewMethod(methodName, {
          [amountInputKey]: item.amount,
          feeRates: item.feeRates,
          path: item.path,
        }),
      ),
    );

    const swapAmount = swapTokens.map((item, index) => {
      if (results[index].error) throw handleErrorMessage(results[index].error, 'GetAmount error');
      const amountIndex = amountResultKey === 'amountOut' ? results[index].data.amount.length - 1 : 0;
      return {
        feeRates: item.feeRates,
        path: item.path,
        [amountInputKey]: item.amount,
        [amountResultKey]: results[index].data.amount[amountIndex],
      };
    });

    return {
      swapTokens: swapAmount as TBestRoutersAmountInfo['swapTokens'],
      allAmount: swapAmount.reduce((pre, cur) => pre.plus(cur[amountResultKey]), ZERO).toFixed(),
    };
  }
}
