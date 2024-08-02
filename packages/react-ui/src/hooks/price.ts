import { useCallback } from 'react';
import { awaken } from '../utils/swap';
import { IFetchTokenPriceParams } from '@portkey/trader-services';

export const useGetTokenPrice = () => {
  return useCallback(async (params: IFetchTokenPriceParams) => {
    return awaken.getTokenPrice(params);
  }, []);
};
