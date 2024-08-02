import { AwakenSwapper } from '@portkey/trader-core';
import { TTokenItem } from '../../types';
import { basicActions } from '../utils';

export const AwakenSwapActions = {
  initialized: 'INITIALIZED',
  destroy: 'DESTROY',
  setSelectTokenModalShow: 'SET_SELECT_TOKEN_MODAL_SHOW',
  setTipsModalShow: 'SET_TIPS_MODAL_SHOW',
  setConfirmModalShow: 'SET_CONFIRM_MODAL_SHOW',
  setSettingModalShow: 'SET_SETTING_MODAL_SHOW',
  setSupportTokenList: 'SET_SUPPORT_TOKEN_LIST',
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
  awakenSwapInstance?: AwakenSwapper;
  supportTokenList: TTokenItem[];
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
  setSupportTokenList: {
    type: AwakenSwapActions['setSupportTokenList'],
    actions: (list: TTokenItem[]) => basicActions(AwakenSwapActions['setSupportTokenList'], { list }),
  },
};
