import { useMemo } from 'react';

import { stringCut, unifyWTokenSymbol } from '@portkey/trader-utils';

import { TokenInfo } from '@portkey/trader-types/src/swap';
import { FontStyleProps } from '@portkey/trader-utils/src/getFontStyle';
import { formatSymbol } from '@portkey/trader-utils/src/token';
import Font from '../Font';

export interface PairProps extends FontStyleProps {
  symbol?: TokenInfo | string;
  maxLength?: number;
}

export default function Pair({ symbol, maxLength, ...props }: PairProps) {
  const text = useMemo(() => {
    if (!symbol) return '--';
    let symbolStr = typeof symbol === 'string' ? symbol : unifyWTokenSymbol(symbol);
    symbolStr = formatSymbol(symbolStr);

    return stringCut(symbolStr, maxLength ?? symbolStr.length);
  }, [maxLength, symbol]);

  return <Font {...props}>{text}</Font>;
}
