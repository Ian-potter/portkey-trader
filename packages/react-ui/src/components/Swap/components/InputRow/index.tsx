import { useMemo } from 'react';
import CommonInput from '../../../../components/CommonInput';
import CommonSvg from '../../../../components/CommonSvg';
import clsx from 'clsx';
import TokenImageDisplay from '../TokenImageDisplay';
import { ZERO } from '../../../../constants/misc';
import './index.less';
import { TTokenItem } from '../../../../types';

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
  onInputChange,
  onSelectToken,
  onClickMax,
}: IInputContainer) {
  const valueInUsd = useMemo(() => {
    if (!(value && priceInUsd)) return '-';
    return `$${ZERO.plus(value).times(priceInUsd).toFixed(2)}`;
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
        <TokenImageDisplay symbol={tokenInfo?.symbol} width={20} />
        <span>{tokenInfo?.symbol}</span>
        <CommonSvg type="icon-arrow-up2" onClick={onSelectToken} />
      </div>
    );
  }, [onSelectToken, tokenInfo?.symbol]);

  return (
    <div className={clsx('swap-input-wrapper', wrapClassName)}>
      <div className="swap-input-row1">{title}</div>
      <div className="swap-input-row2 portkey-swap-flex-row-between">
        <CommonInput
          onChange={(e) => onInputChange(e.target.value)}
          value={value || ''}
          placeholder={placeholder}
          className="swap-input-value"
          wrapClassName="portkey-swap-flex-1"
          disabled={!tokenInfo}
          // ref={inputRef}
        />
        {tokenInfo ? renderTokenInfo : renderSelectToken}
      </div>
      <div className="swap-input-row3 portkey-swap-flex-row-between">
        <div className="portkey-swap-flex-row-center">
          <span className="value-in-usd">{valueInUsd}</span>
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
