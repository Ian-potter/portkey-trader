import { ISwapperBaseConfig } from '../types';

export interface ISwapperContractConfig {
  swapContractAddress: string;
  hookContractAddress: string;
  rpcUrl: string;
}

export interface IAwakenSwapperConfig extends ISwapperBaseConfig {
  contractConfig: ISwapperContractConfig;
}
