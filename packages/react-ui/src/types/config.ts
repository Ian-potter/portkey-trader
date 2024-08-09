import { IPortkeySwapperAdapter, TContractOption, TTokenApproveHandler } from '@portkey/trader-core';
import { ComponentType } from './common';
import { ISwapPanel } from '../components/Swap/components/SwapPanel';
import { ChainId } from './token';

export interface IAwakenConfig {
  instance?: IPortkeySwapperAdapter;
  tokenApprove?: TTokenApproveHandler;
  getOptions?: () => Promise<{ contractOptions: TContractOption; address: string } | undefined | void>;
}

export interface ISwapProps extends ISwapPanel {
  containerClassName?: string;
  chainId?: ChainId;
  componentUiType?: ComponentType;
  awaken?: IAwakenConfig;
}
