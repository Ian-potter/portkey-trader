import { IAwakenSwapperConfig } from '@portkey/trader-core';
import { NetworkType } from '../types';

export interface IAwakenConfigProviderProps {
  config: IAwakenConfigProps;
  getAllConfig: () => IAwakenConfigProps;
  getConfig: (key: ConfigKey) => IAwakenConfigProps[typeof key];
  setConfig: (config: Partial<IAwakenConfigProps>) => void;
}

export type ConfigKey = keyof IAwakenConfigProps;

export interface IAwakenConfigProps extends IAwakenSwapperConfig {
  networkType: NetworkType;
}
