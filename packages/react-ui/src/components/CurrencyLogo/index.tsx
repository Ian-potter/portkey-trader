import { Currency } from '@awaken/sdk-core';
// import Logo from 'components/Logo';
// import { ChainConstants } from 'constants/ChainConstants';
import { useMemo } from 'react';
// import { getTokenLogoURLs } from 'utils';
import { ImageProps } from 'antd';
import './index.less';
import clsx from 'clsx';
import Logo from '../Logo';
// import { NATIVE_LOGO } from 'assets/logo';
// import { getPairsLogoOrderByTokenWeights } from 'utils/pair';
export function CurrencyLogo({
  currency,
  address,
  alt,
  size = 20,
  style,
  src,
  preview,
  className,
  symbol,
}: {
  currency?: Currency | null;
  address?: string;
  size?: number;
  symbol?: string;
} & ImageProps) {
  console.log(address, src);
  // const srcs: string[] = useMemo(() => {
  //   if (src) return [src];
  //   if (address) {
  //     const { symbol: basesSymbol } = ChainConstants.constants.COMMON_BASES[0] || {};
  //     if (basesSymbol && address.includes(basesSymbol)) return [NATIVE_LOGO[basesSymbol]];
  //     const key = ChainConstants.chainType === 'ELF' ? symbol : address;
  //     return [...getTokenLogoURLs(key)];
  //   }
  //   if (!currency) return [];
  //   if (currency?.isNative) return [NATIVE_LOGO[currency.symbol || 'ETH']];

  //   const key = currency.isToken ? currency.address : currency.symbol;
  //   const defaultUrls = [...getTokenLogoURLs(key)];
  //   return defaultUrls;
  // }, [address, currency, src, symbol]);
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
      srcs={['srcs']}
      alt={alt || (currency?.isNative ? 'ethereum logo' : currency?.symbol) || 'error logo'}
      symbol={symbol || currency?.symbol}
    />
  );
}
export function CurrencyLogos({
  tokens = [],
  size = 20,
  preview,
  className,
  isSortToken = true,
}: {
  className?: string;
  preview?: boolean;
  size?: number;
  tokens?: Array<{
    address?: string;
    src?: string;
    currency?: Currency | null;
    symbol?: string;
  }>;
  isSortToken?: boolean;
}) {
  const tokenList = useMemo(() => {
    return [
      {
        currency: null,
        address: '',
        src: '',
        symbol: '',
      },
    ];
    // if (!isSortToken) return tokens;
    // return getPairsLogoOrderByTokenWeights(tokens);
  }, []);

  return (
    <div
      className={clsx('currency-logo', className)}
      style={{
        maxWidth: tokens.length === 1 ? size : `${Math.ceil(size * tokens.length - size / 4)}px`,

        maxHeight: tokens.length === 1 ? size : `${Math.ceil(size * tokens.length - size / 4)}px`,
      }}>
      {tokenList.map((i, k) => {
        const { currency, address, src, symbol } = i || {};
        return (
          <CurrencyLogo
            key={k}
            size={size}
            src={src}
            currency={currency}
            address={address}
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
