import {
  BestSwapRoutesAmountInParams,
  BestSwapRoutesAmountOutParams,
  FetchTokenListParams,
  IApiResponse,
  IBestSwapRoutes,
  ITokenList,
} from './baseSwapper';

export interface IAwakenService {
  /**
   *
   * @param routeType - routeType: 0, input amountIn get amountOut,  routeType: 1, input amountOut get amountIn
   */
  fetchBestSwapRoutes(params: BestSwapRoutesAmountInParams): Promise<IApiResponse<IBestSwapRoutes>>;
  fetchBestSwapRoutes(params: BestSwapRoutesAmountOutParams): Promise<IApiResponse<IBestSwapRoutes>>;

  getSupportTokenList(params: FetchTokenListParams): Promise<IApiResponse<ITokenList>>;
}

// const func = ((params: any) => {
//   return 'a' as any;
// }) as unknown as IAwakenService;

// func.fetchBestSwapRoutes({
//   chainId: 'AELF',
//   symbolIn: 'ELF',
//   symbolOut: 'ETH',
//   routeType: RouteType.AmountIn,
//   amountIn: 100,
//   // amountOut: 100,
//   // amountIn: 10,
//   // amountOut: 100,
//   // amountIn: 100,
//   // amountOut: 100,
//   // amountIn
//   // amountIn: 1100,
//   // amountOut: 100,
// });
