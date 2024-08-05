import './index.less';
import { useMemo } from 'react';
import { ImageProps } from 'antd';
import clsx from 'clsx';
import Logo from '../Logo';
import { getTokenLogoUrl } from '../../utils';
import { getPairsLogoOrderByTokenWeights } from '../../utils/token';
import { TTokenItem } from '../../types';

export function CurrencyLogo({
  alt,
  size = 20,
  style,
  src,
  preview,
  className,
  symbol,
}: {
  symbol?: string;
  size?: number;
} & ImageProps) {
  const srcs = useMemo(() => [getTokenLogoUrl(symbol)], [symbol]);

  return (
    <Logo
      className={className}
      preview={preview}
      style={{
        borderRadius: size / 2,
        width: size,
        height: size,
        ...style,
      }}
      size={size}
      srcs={srcs || [src]}
      alt={alt || 'logo'}
      symbol={symbol}
    />
  );
}
export function CurrencyLogos({
  tokens,
  size = 20,
  preview,
  className,
  isSortToken = true,
}: {
  className?: string;
  preview?: boolean;
  size?: number;
  tokens: TTokenItem[];
  isSortToken?: boolean;
}) {
  const tokenList = useMemo(
    () => (isSortToken ? getPairsLogoOrderByTokenWeights(tokens) : tokens),
    [isSortToken, tokens],
  );

  return (
    <div
      className={clsx('currency-logo', className)}
      style={{
        // maxWidth: tokens.length === 1 ? size : `${Math.ceil(size * tokens.length - size / 4)}px`,

        maxHeight: tokens.length === 1 ? size : `${Math.ceil(size * tokens.length - size / 4)}px`,
      }}>
      {tokenList.map((i, k) => {
        const { symbol } = i;
        return (
          <CurrencyLogo
            key={k}
            size={size}
            preview={preview}
            symbol={symbol || ''}
            style={{
              zIndex: tokens.length - k,
              marginLeft: k === 0 ? 0 : `-${size / 4}px`,
            }}
          />
        );
      })}
    </div>
  );
}
