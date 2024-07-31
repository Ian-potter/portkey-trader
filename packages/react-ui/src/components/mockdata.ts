import { Currency } from '@awaken/sdk-core';
export const mockCurrency: Currency = {
  isNative: true,
  isToken: false,
  isELFChain: false,
  chainId: 'AELF',
  decimals: 8,
  symbol: 'ELF',
  equals: () => false,
  wrapped: '' as any,
};
