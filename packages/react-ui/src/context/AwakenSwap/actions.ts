import { basicActions } from '../utils';

export const AwakenSwapActions = {
  initialized: 'INITIALIZED',
  destroy: 'DESTROY',
  setSelectTokenModalShow: 'setSelectTokenModal',
};

export interface AwakenSwapState {
  // chain
  isSelectModalShow: boolean;
  chainItem: any;
  chainList?: any[];
}

export const swapActions = {
  initialized: {
    type: AwakenSwapActions['initialized'],
    actions: (initialized: AwakenSwapState) => basicActions(AwakenSwapActions['initialized'], { initialized }),
  },
  destroy: {
    type: AwakenSwapActions['destroy'],
    actions: () => basicActions(AwakenSwapActions['destroy']),
  },
  setSelectTokenModalShow: {
    type: AwakenSwapActions['setSelectTokenModalShow'],
    actions: (isOpen: boolean) => basicActions(AwakenSwapActions['setSelectTokenModalShow'], { isOpen }),
  },
};
