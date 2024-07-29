import { IBaseRequest } from '@portkey/types';

export abstract class BaseService<T = IBaseRequest> {
  protected readonly _request: T;

  public constructor(request: T) {
    this._request = request;
  }
}

export type BaseListResponse<T = any> = {
  data: T[];
  totalRecordCount: number;
};

export type BaseApiResponse<T = any> = {
  code: string;
  message?: string;
  data: BaseListResponse<T>;
};

export * from './awaken';
export * from './baseSwapper';
