import { IBaseRequest } from '@portkey/types';
import {
  BaseService,
  BestSwapRoutesAmountInParams,
  BestSwapRoutesAmountOutParams,
  IApiResponse,
  IBestSwapRoutes,
  IAwakenService,
} from '../types';

export class AwakenService<T extends IBaseRequest = IBaseRequest> extends BaseService<T> implements IAwakenService {
  fetchBestSwapRoutes(
    params: BestSwapRoutesAmountInParams | BestSwapRoutesAmountOutParams,
  ): Promise<IApiResponse<IBestSwapRoutes>> {
    return this._request.send({
      method: 'GET',
      url: '/api/app/route/best-swap-routes',
      params,
    });
  }
}
