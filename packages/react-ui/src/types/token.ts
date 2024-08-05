export type ChainId = 'AELF' | 'tDVV' | 'tDVW';

export type TTokenItem = {
  symbol: string;
  decimals: number;
  address: string;
  chainId?: ChainId;
};
