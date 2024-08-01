import { useMemo } from 'react';
import CommonInput from '../../../../components/CommonInput';
import CommonSvg from '../../../../components/CommonSvg';
import { Currency } from '@awaken/sdk-core';
import clsx from 'clsx';
import TokenImageDisplay from '../TokenImageDisplay';
import './index.less';

export interface IInputContainer {
  title?: string;
  wrapClassName?: string;
  value?: number | string;
  valueInUsd?: number | string;
  balance?: number | string;
  placeholder?: string;
  tokenInfo?: Currency;
  showMax?: boolean;
  onInputChange: (v: string) => void;
  onSelectToken: () => void;
  onClickMax?: () => void;
}

export default function InputContainer({
  title = 'Pay',
  wrapClassName,
  value = 0,
  valueInUsd = '-',
  balance = '-',
  placeholder = '0.00',
  tokenInfo,
  showMax,
  onInputChange,
  onSelectToken,
  onClickMax,
}: IInputContainer) {
  const renderSelectToken = useMemo(() => {
    return (
      <div className="select-token-wrap portkey-swap-flex-row-center">
        <div className="select-token-wrap-text">{`Select a token`}</div>
        <CommonSvg type="icon-arrow-down2" onClick={onSelectToken} />
      </div>
    );
  }, [onSelectToken]);
  const renderTokenInfo = useMemo(() => {
    return (
      <div className="show-token-wrap portkey-swap-flex-row-center">
        <TokenImageDisplay symbol="ELF" width={20} />
        <span>{`ELF`}</span>
        <CommonSvg type="icon-arrow-up2" onClick={onSelectToken} />
      </div>
    );
  }, [onSelectToken]);

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
          // disabled={!tokenInfo}
          // ref={inputRef}
        />
        {tokenInfo ? renderTokenInfo : renderSelectToken}
      </div>
      <div className="swap-input-row3 portkey-swap-flex-row-between">
        <div className="portkey-swap-flex-row-center">
          <span className="value-in-usd">{valueInUsd}</span>
          <span className="percent-show">{`-0.32%`}</span>
        </div>
        <div className="portkey-swap-flex-row-center">
          <div className="balance-show">{`Balance: ${balance}`}</div>
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
