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
export const useAwakenSwapContext = (): [AwakenSwapState, BasicActions] => useContext(AwakenSwapContext);

export function AwakenSwapProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  // const chain = useMemo(() => {
  //   const networkType = ETransferConfig.getConfig('networkType') as NetworkType;
  //   const defaultChainIds = networkType === 'TESTNET' ? [CHAIN_ID.tDVW, CHAIN_ID.AELF] : [CHAIN_ID.tDVV, CHAIN_ID.AELF];
  //   const supportChainIds = depositConfigRef.current?.supportChainIds || defaultChainIds;
  //   const chainList: IChainMenuItem[] = [];
  //   supportChainIds.forEach((item) => {
  //     if (CHAIN_MENU_DATA[item]?.key) {
  //       chainList.push(CHAIN_MENU_DATA[item]);
  //     }
  //   });
  //   return {
  //     chainList: chainList,
  //     chainItem: chainList[0],
  //   };
  // }, []);

  // const providerValue = useMemo<[ETransferDepositState, { dispatch: React.Dispatch<any> }]>(() => {
  //   const { chainId, network, depositToken, receiveToken } = getDepositDefaultConfig();
  //   let currentChainItem: IChainMenuItem | undefined;
  //   if (chainId) {
  //     currentChainItem = chain.chainList?.find((chain) => chain.key === chainId);
  //   }

  //   return [
  //     {
  //       chainList: chain.chainList,
  //       chainItem: currentChainItem || chain.chainItem,
  //       networkItem: { network: network },
  //       depositTokenSymbol: depositToken,
  //       receiveTokenSymbol: receiveToken,
  //       ...state,
  //     },
  //     { dispatch },
  //   ];
  // }, [chain.chainItem, chain.chainList, state]);

  const providerValue = useMemo<[AwakenSwapState, { dispatch: React.Dispatch<any> }]>(() => {
    return [
      {
        ...state,
      },
      { dispatch },
    ];
  }, [state]);

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
