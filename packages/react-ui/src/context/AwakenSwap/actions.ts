import { ComponentType } from '@/types';
import { basicActions } from '../utils';

export const AwakenSwapActions = {
  initialized: 'INITIALIZED',
  destroy: 'DESTROY',
  setSelectTokenModalShow: 'setSelectTokenModal',
  setTipsModalShow: 'setTipsModalShow',
  setConfirmModalShow: 'setConfirmModalShow',
  setSettingModalShow: 'setSettingModalShow',
};

export interface AwakenSwapState {
  isMobile: boolean;
  isSelectModalShow: boolean;
  isConfirmModalShow: boolean;
  isSettingModalShow: boolean;
  isTipsModalShow: boolean;
  tipsModalInfo: {
    title: string;
    content: string;
  };
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
    actions: (isSelectModalShow: boolean) =>
      basicActions(AwakenSwapActions['setSelectTokenModalShow'], { isSelectModalShow }),
  },
  setConfirmModalShow: {
    type: AwakenSwapActions['setConfirmModalShow'],
    actions: (isConfirmModalShow: boolean) =>
      basicActions(AwakenSwapActions['setConfirmModalShow'], { isConfirmModalShow }),
  },
  setSettingModalShow: {
    type: AwakenSwapActions['setSettingModalShow'],
    actions: (isSettingModalShow: boolean) =>
      basicActions(AwakenSwapActions['setSettingModalShow'], { isSettingModalShow }),
  },
  setTipsModalShow: {
    type: AwakenSwapActions['setTipsModalShow'],
    actions: (isTipsModalShow: boolean) => basicActions(AwakenSwapActions['setTipsModalShow'], { isTipsModalShow }),
  },
};
