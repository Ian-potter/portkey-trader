import { useMemo } from 'react';
import { FontStyleProps } from '@portkey/trader-utils';
import Pair from './Pair';
import Font from '../Font';
import { TokenInfo } from '@portkey/trader-types/src/swap';
import { getPairsOrderByTokenWeights } from '@portkey/trader-utils';
import './index.less';

export interface PairsProps extends FontStyleProps {
  tokenA?: TokenInfo | string;
  tokenB?: TokenInfo | string;
  delimiter?: string;
  maxLength?: number;
  isAutoOrder?: boolean;
}

export default function Pairs({ tokenA, tokenB, isAutoOrder = true, delimiter = '/', ...props }: PairsProps) {
  const tokens = useMemo(() => {
    if (!isAutoOrder) return [tokenA, tokenB];
    return getPairsOrderByTokenWeights(tokenA, tokenB);
  }, [isAutoOrder, tokenA, tokenB]);

  return (
    <span className="pairs">
      <Pair symbol={tokens[0] ?? '---'} {...props} />
      <Font {...props}>{delimiter}</Font>
      <Pair symbol={tokens[1] ?? '---'} {...props} />
    </span>
  );
}
