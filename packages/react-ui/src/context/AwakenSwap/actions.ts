import { basicActions } from '../utils';

export const AwakenSwapActions = {
  initialized: 'INITIALIZED',
  destroy: 'DESTROY',
  setDepositTokenSymbol: 'setDepositTokenSymbol',
  setDepositTokenList: 'setDepositTokenList',
  setNetworkItem: 'setNetworkItem',
  setNetworkList: 'setNetworkList',
  setReceiveTokenSymbol: 'setReceiveTokenSymbol',
  setReceiveTokenList: 'setReceiveTokenList',
  setChainItem: 'setChainItem',
  setChainList: 'setChainList',
};

export interface AwakenSwapState {
  // chain
  chainItem: any;
  chainList?: any[];
}

export const swapActions = {
  initialized: {
    type: AwakenSwapActions['initialized'],
    actions: (initialized: AwakenSwapState) => basicActions(AwakenSwapActions['initialized'], { initialized }),
  },
  setDepositTokenSymbol: {
    type: AwakenSwapActions['setDepositTokenSymbol'],
    actions: (symbol: string) => basicActions(AwakenSwapActions['setDepositTokenSymbol'], { symbol }),
  },
  destroy: {
    type: AwakenSwapActions['destroy'],
    actions: () => basicActions(AwakenSwapActions['destroy']),
  },
};
