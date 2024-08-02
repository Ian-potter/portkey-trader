import React, { createContext, useMemo, useReducer, useContext } from 'react';
import { AwakenSwapActions, AwakenSwapState } from './actions';
import { BasicActions } from '../utils';

const INITIAL_STATE: AwakenSwapState = {
  isMobile: false,
  isSelectModalShow: false,
  isConfirmModalShow: false,
  isSettingModalShow: false,
  isTipsModalShow: false,
  tipsModalInfo: {
    title: '',
    content: '',
  },
};

const AwakenSwapContext = createContext<any>(INITIAL_STATE);
export function useAwakenSwapContext(): [AwakenSwapState, BasicActions] {
  return useContext(AwakenSwapContext);
}

export function AwakenSwapProvider({ children, isMobile }: { children: React.ReactNode; isMobile: boolean }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const providerValue = useMemo<[AwakenSwapState, { dispatch: React.Dispatch<any> }]>(() => {
    return [
      {
        isMobile,
        ...state,
      },
      { dispatch },
    ];
  }, [isMobile, state]);

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
    case AwakenSwapActions.setConfirmModalShow: {
      const isConfirmModalShow = payload.isConfirmModalShow;
      return Object.assign({}, state, { isConfirmModalShow });
    }
    case AwakenSwapActions.setSettingModalShow: {
      const isSettingModalShow = payload.isSettingModalShow;
      return Object.assign({}, state, { isSettingModalShow });
    }
    case AwakenSwapActions.destroy: {
      return INITIAL_STATE;
    }
    default: {
      return Object.assign({}, state, payload);
    }
  }
}
