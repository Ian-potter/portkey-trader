import { useMemo, useRef, useCallback } from 'react';
import CommonInput from '../../../../components/CommonInput';
import CommonSvg from '../../../../components/CommonSvg';
import clsx from 'clsx';
import { ZERO } from '../../../../constants/misc';
import { TTokenItem } from '../../../../types';
import { CurrencyLogo } from '../../../../components/CurrencyLogo';
import { divDecimals } from '@portkey/trader-utils';
import BigNumber from 'bignumber.js';
import { isValidNumber } from '../../../../utils/reg';
import { parseInputChange } from '../../../../utils/input';
import PriceUSDDigits from '../../../../components/PriceUSDDigits';
import { Pair } from '../../../Pair';
import './index.less';

export interface IInputContainer {
  title?: string;
  wrapClassName?: string;
  value?: number | string;
  priceInUsd?: number | string;
  balance?: number | string;
  placeholder?: string;
  tokenInfo?: TTokenItem;
  showMax?: boolean;
  usdSuffix?: React.ReactNode;
  inputDisabled: boolean;
  onInputChange: (v: string) => void;
  onSelectToken: () => void;
  onClickMax?: () => void;
}

export default function InputContainer({
  title = 'Pay',
  wrapClassName,
  value = 0,
  priceInUsd,
  balance = '-',
  placeholder = '0.00',
  tokenInfo,
  showMax,
  usdSuffix,
  inputDisabled,
  onInputChange,
  onSelectToken,
  onClickMax,
}: IInputContainer) {
  const min = useRef<BigNumber>(divDecimals('1', tokenInfo?.decimals));
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      if (v && !isValidNumber(v)) return;
      onInputChange?.(parseInputChange(v, min.current, tokenInfo?.decimals));
    },
    [onInputChange, tokenInfo?.decimals],
  );

  const valueInUsd = useMemo(() => {
    if (!(value && priceInUsd)) return undefined;
    return ZERO.plus(value).times(priceInUsd);
  }, [priceInUsd, value]);

  const renderSelectToken = useMemo(() => {
    return (
      <div className="select-token-wrap portkey-swap-flex-row-center" onClick={onSelectToken}>
        <div className="select-token-wrap-text">{`Select a token`}</div>
        <CommonSvg type="icon-arrow-down2" />
      </div>
    );
  }, [onSelectToken]);
  const renderTokenInfo = useMemo(() => {
    return (
      <div className="show-token-wrap portkey-swap-flex-row-center">
        <CurrencyLogo size={20} symbol={tokenInfo?.symbol} />
        <Pair lineHeight={24} size={16} weight="medium" symbol={tokenInfo?.symbol} />
        <CommonSvg type="icon-arrow-up2" onClick={onSelectToken} />
      </div>
    );
  }, [onSelectToken, tokenInfo?.symbol]);

  return (
    <div className={clsx('swap-input-wrapper', wrapClassName)}>
      <div className="swap-input-row1">{title}</div>
      <div className="swap-input-row2 portkey-swap-flex-row-between">
        <CommonInput
          onChange={handleInputChange}
          value={value || ''}
          placeholder={placeholder}
          className={clsx('swap-input-value', value && 'swap-input-value-value')}
          wrapClassName="portkey-swap-flex-1"
          disabled={!tokenInfo || inputDisabled}
        />
        {tokenInfo ? renderTokenInfo : renderSelectToken}
      </div>
      <div className="swap-input-row3 portkey-swap-flex-row-between">
        <div className="portkey-swap-flex-row-center">
          <PriceUSDDigits wrapperClassName="value-in-usd" price={valueInUsd} />
          <span className="usd-suffix-show">{usdSuffix}</span>
        </div>
        <div className="portkey-swap-flex-row-center">
          <div className="balance-show">{`Balance: ${balance ? balance : '-'}`}</div>
          {showMax && (
            <div className="show-max" onClick={onClickMax}>
              MAX
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
