import { ChainId } from '../types';
import { useAwakenSwapContext } from '../context/AwakenSwap';
import { swapActions } from '../context/AwakenSwap/actions';
import { useCallback } from 'react';
import { useEffectOnce } from 'react-use';

export const useTokenList = (chainId?: ChainId) => {
  const [{ supportTokenList, awaken }, { dispatch }] = useAwakenSwapContext();

  const getList = useCallback(async () => {
    try {
      const list = await awaken?.instance?.getSupportTokenList({ chainId: chainId || 'tDVW' });
      dispatch(swapActions.setSupportTokenList.actions((list || []) as any));
    } catch (error) {
      console.log(error);
    }
  }, [awaken?.instance, chainId, dispatch]);

  useEffectOnce(() => {
    if (!supportTokenList.length) getList();
  });

  return supportTokenList;
};
