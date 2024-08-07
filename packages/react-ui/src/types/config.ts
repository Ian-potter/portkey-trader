import { IPortkeySwapperAdapter, TContractOption, TTokenApproveHandler } from '@portkey/trader-core';
import { ComponentType } from './common';
import { ISwapPanel } from '../components/Swap/components/SwapPanel';

export interface IAwakenConfig {
  instance?: IPortkeySwapperAdapter;
  tokenApprove?: TTokenApproveHandler;
  getOptions?: () => Promise<{ contractOptions: TContractOption; address: string } | undefined | void>;
}

export interface ISwapProps extends ISwapPanel {
  containerClassName?: string;
  componentUiType?: ComponentType;
  awaken?: IAwakenConfig;
}
