import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { formatPriceUSDSplit } from '@portkey/trader-utils';
import DecimalsSink, { IBaseDecimalsSinkProps } from '../DecimalsSink';

export interface IPriceUSDDecimalsSinkProps extends IBaseDecimalsSinkProps {
  price?: BigNumber.Value;
}

export default function PriceUSDDecimalsSink({ price, prefix = '$', ...props }: IPriceUSDDecimalsSinkProps) {
  const priceInfo = useMemo(() => (typeof price !== 'undefined' ? formatPriceUSDSplit(price) : undefined), [price]);
  return <DecimalsSink {...props} {...priceInfo} prefix={prefix} />;
}
