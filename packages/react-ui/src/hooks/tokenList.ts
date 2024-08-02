import { useAwakenSwapContext } from '../context/AwakenSwap';
import { swapActions } from '../context/AwakenSwap/actions';
import { useCallback } from 'react';
import { useEffectOnce } from 'react-use';

export const useTokenList = () => {
  const [{ supportTokenList, awakenSwapInstance }, { dispatch }] = useAwakenSwapContext();

  const getList = useCallback(async () => {
    try {
      const list = await awakenSwapInstance?.getSupportTokenList({ chainId: 'tDVW' });
      dispatch(swapActions.setSupportTokenList.actions(list || []));
    } catch (error) {
      console.log(error);
    }
  }, [awakenSwapInstance, dispatch]);

  useEffectOnce(() => {
    if (!supportTokenList.length) getList();
  });

  return supportTokenList;
};
