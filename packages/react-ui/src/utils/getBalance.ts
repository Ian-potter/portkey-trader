import { COMMON_PRIVATE } from '../constants';
import { awaken } from './swap';
import { aelf } from '@portkey/utils';

export const getBalance = async ({ symbol, owner }: { symbol: string; owner: string }) => {
  const res = await awaken.getBalance({
    symbol,
    owner,
    contractOption: {
      account: aelf.getWallet(COMMON_PRIVATE),
    },
  });
  return res;
};
