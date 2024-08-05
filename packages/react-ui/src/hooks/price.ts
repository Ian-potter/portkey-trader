import { useCallback } from 'react';
import { IFetchTokenPriceParams } from '@portkey/trader-services';
import { useAwakenSwapContext } from '../context/AwakenSwap';

export const useGetTokenPrice = () => {
  const [{ awaken }] = useAwakenSwapContext();
  return useCallback(
    async (params: IFetchTokenPriceParams) => {
      return awaken?.instance?.getTokenPrice(params);
    },
    [awaken?.instance],
  );
};
