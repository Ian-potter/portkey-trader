import { ISwapperBaseConfig } from '../types';

export interface ISwapperContractConfig {
  contractAddress: string;
  rpcUrl: string;
}

export interface IAwakenSwapperConfig extends ISwapperBaseConfig {
  contractConfig: ISwapperContractConfig;
}
