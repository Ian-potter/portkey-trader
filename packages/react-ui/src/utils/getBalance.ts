import { COMMON_PRIVATE } from '../constants';
import { aelf } from '@portkey/utils';
import { IAwakenConfig } from '../types';

export const getBalance = async ({
  symbol,
  owner,
  awaken,
}: {
  symbol: string;
  owner: string;
  awaken: IAwakenConfig;
}) => {
  const res = await awaken?.instance?.getBalance({
    symbol,
    owner,
    contractOption: {
      account: aelf.getWallet(COMMON_PRIVATE),
    },
  });
  return res;
};
