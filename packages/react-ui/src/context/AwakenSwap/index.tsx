import React, { createContext, useMemo, useReducer, useContext } from 'react';
import { AwakenSwapActions, AwakenSwapState } from './actions';
import { BasicActions } from '../utils';
import { IAwakenConfig } from '../../types/config';
import { ChainId } from '../../types';

const INITIAL_STATE: AwakenSwapState = {
  isSelectModalShow: false,
  isConfirmModalShow: false,
  isSettingModalShow: false,
  isTipsModalShow: false,
  isOrderRoutingModalShow: false,
  tipsModalInfo: {
    title: '',
    content: '',
  },
  supportTokenList: [],
};

const AwakenSwapContext = createContext<any>(INITIAL_STATE);
export function useAwakenSwapContext(): [AwakenSwapState, BasicActions] {
  return useContext(AwakenSwapContext);
}

export function AwakenSwapProvider({
  children,
  isMobile,
  awaken,
  chainId,
}: {
  children: React.ReactNode;
  isMobile: boolean;
  awaken?: IAwakenConfig;
  chainId?: ChainId;
}) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const providerValue = useMemo<[AwakenSwapState, { dispatch: React.Dispatch<any> }]>(() => {
    return [
      {
        awaken,
        isMobile,
        chainId,
        ...state,
      },
      { dispatch },
    ];
  }, [awaken, chainId, isMobile, state]);

  return <AwakenSwapContext.Provider value={providerValue}>{children}</AwakenSwapContext.Provider>;
}

//reducer
function reducer(state: AwakenSwapState, { type, payload }: any) {
  switch (type) {
    case AwakenSwapActions.setSelectTokenModalShow: {
      const isSelectModalShow = payload.isSelectModalShow;
      return Object.assign({}, state, { isSelectModalShow });
    }
    case AwakenSwapActions.setTipsModalShow: {
      const isTipsModalShow = payload.isTipsModalShow;
      return Object.assign({}, state, { isTipsModalShow });
    }
    case AwakenSwapActions.setTipsModalInfo: {
      const tipsModalInfo = payload.tipsModalInfo;
      return Object.assign({}, state, { tipsModalInfo });
    }
    case AwakenSwapActions.setConfirmModalShow: {
      const isConfirmModalShow = payload.isConfirmModalShow;
      return Object.assign({}, state, { isConfirmModalShow });
    }
    case AwakenSwapActions.setSettingModalShow: {
      const isSettingModalShow = payload.isSettingModalShow;
      return Object.assign({}, state, { isSettingModalShow });
    }
    case AwakenSwapActions.setOrderRoutingModalShow: {
      const isOrderRoutingModalShow = payload.isOrderRoutingModalShow;
      return Object.assign({}, state, { isOrderRoutingModalShow });
    }
    case AwakenSwapActions.setSupportTokenList: {
      const list = payload.list;
      return Object.assign({}, state, { supportTokenList: list });
    }
    case AwakenSwapActions.destroy: {
      return INITIAL_STATE;
    }
    default: {
      return Object.assign({}, state, payload);
    }
  }
}
