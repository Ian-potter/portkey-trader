export function isEqCurrency(c1?: any, c2?: any) {
  // return c1 && c2 && c1?.equals(c2);
  return c1 && c2 && c1.symbol === c2.symbol && c1.chainId === c2.chainId;
}

export const getTokenLogoUrl = (symbol?: string) => {
  return `https://raw.githubusercontent.com/Awaken-Finance/assets/main/blockchains/AELF/assets/${symbol}/logo24@3x.png`;
};
