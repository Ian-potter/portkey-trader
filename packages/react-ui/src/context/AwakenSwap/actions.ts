import { ChainId, TTokenItem } from '../../types';
import { basicActions } from '../utils';
import { IAwakenConfig } from '../../types/config';

export const AwakenSwapActions = {
  initialized: 'INITIALIZED',
  destroy: 'DESTROY',
  setSelectTokenModalShow: 'SET_SELECT_TOKEN_MODAL_SHOW',
  setTipsModalShow: 'SET_TIPS_MODAL_SHOW',
  setTipsModalInfo: 'SET_TIPS_MODAL_INFO',
  setConfirmModalShow: 'SET_CONFIRM_MODAL_SHOW',
  setSettingModalShow: 'SET_SETTING_MODAL_SHOW',
  setOrderRoutingModalShow: 'SET_ORDER_ROUTING_MODAL_SHOW',
  setSupportTokenList: 'SET_SUPPORT_TOKEN_LIST',
};

export interface AwakenSwapState {
  isMobile?: boolean;
  isSelectModalShow: boolean;
  isConfirmModalShow: boolean;
  isSettingModalShow: boolean;
  isTipsModalShow: boolean;
  isOrderRoutingModalShow: boolean;
  tipsModalInfo: {
    title: string;
    content: string;
  };
  awaken?: IAwakenConfig;
  supportTokenList: TTokenItem[];
  chainId?: ChainId;
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
  setTipsModalInfo: {
    type: AwakenSwapActions['setTipsModalInfo'],
    actions: (tipsModalInfo: { title: string; content: string }) =>
      basicActions(AwakenSwapActions['setTipsModalInfo'], { tipsModalInfo }),
  },
  setOrderRoutingModalShow: {
    type: AwakenSwapActions['setOrderRoutingModalShow'],
    actions: (isOrderRoutingModalShow: boolean) =>
      basicActions(AwakenSwapActions['setOrderRoutingModalShow'], { isOrderRoutingModalShow }),
  },
  setSupportTokenList: {
    type: AwakenSwapActions['setSupportTokenList'],
    actions: (list: TTokenItem[]) => basicActions(AwakenSwapActions['setSupportTokenList'], { list }),
  },
};
