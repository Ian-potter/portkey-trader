import { IPortkeySwapperAdapter, TContractOption, TTokenApproveHandler } from '@portkey/trader-core';
import { ComponentType } from './common';

export interface IAwakenConfig {
  instance?: IPortkeySwapperAdapter;
  tokenApprove?: TTokenApproveHandler;
  getOptions?: () => Promise<{ contractOptions: TContractOption; address: string } | undefined | void>;
}

export interface ISwapProps {
  containerClassName?: string;
  componentUiType?: ComponentType;
  awaken?: IAwakenConfig;
}
