import BigNumber from 'bignumber.js';
import clsx from 'clsx';
import { CSSProperties, useMemo } from 'react';
import { TSize } from '../../types';
import './index.less';
import { ONE, ZERO, formatPriceUSD } from '@portkey/trader-utils';
import PriceUSDDecimalsSink from '../PriceUSDDecimalsSink';

export default function PriceUSDDigits({
  price,
  prefix = '$',
  suffix = '',
  className,
  wrapperClassName,
  style,
  size,
  isSink,
  isUSDUnit = false,
  isPlusPrefixShow = false,
  isUSDUnitZero = false,
}: {
  price?: BigNumber.Value;
  prefix?: string;
  suffix?: string;
  className?: string;
  wrapperClassName?: string;
  style?: CSSProperties;
  size?: TSize;
  isSink?: boolean;
  isUSDUnit?: boolean;
  isPlusPrefixShow?: boolean;
  isUSDUnitZero?: boolean;
}) {
  // TODO
  const isMobile = false;

  const _prefix = useMemo(() => {
    if (!isPlusPrefixShow) return prefix;
    return ZERO.lt(price ?? 0) ? `${prefix}+` : prefix;
  }, [isPlusPrefixShow, prefix, price]);

  const usdUnitPrice = useMemo(() => {
    if (!isUSDUnit) return `${prefix}0`;
    const _price = price ?? 0;
    if (ZERO.eq(_price)) return `${prefix}0`;

    if (ONE.div(100).gt(ZERO.plus(_price).abs() || 0)) {
      return isUSDUnitZero ? `${prefix}0` : `${prefix}<0.01`;
    }

    return `${_prefix}${formatPriceUSD(price)}`;
  }, [_prefix, isUSDUnit, isUSDUnitZero, prefix, price]);

  if (isUSDUnit)
    return (
      <span className={clsx('price-digits-inner', size && `price-digits-${size}`, className)}>
        {typeof price !== 'undefined' ? `${usdUnitPrice}${suffix}` : '-'}
      </span>
    );

  return (
    <span style={style} className={clsx('price-digits-wrapper', wrapperClassName)}>
      {isMobile || isSink ? (
        <PriceUSDDecimalsSink prefix={_prefix} suffix={suffix} price={price} className={className} />
      ) : (
        <span className={clsx('price-digits-inner', size && `price-digits-${size}`, className)}>
          {typeof price !== 'undefined' ? `${_prefix}${formatPriceUSD(price)}${suffix}` : '-'}
        </span>
      )}
    </span>
  );
}
