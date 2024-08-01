import BigNumber from 'bignumber.js';
import { Button, Col, InputProps, Row } from 'antd';
import { useMemo } from 'react';
import clsx from 'clsx';
import Font from '../../Font';

import { Currency } from '@awaken/sdk-core';
// import { parseInputChange, unitConverter } from 'utils';
// import { useTranslation } from 'react-i18next';
// import { useTokenPrice } from 'contexts/useTokenPrice/hooks';
// import { isValidNumber } from 'utils/reg';
// import { divDecimals } from 'utils/calculate';

import CommonInput from '../../CommonInput';
// import Font from 'components/Font';
// import { ZERO } from 'constants/misc';

import './styles.less';
// import PriceUSDDigits from '../../PriceUSDDigits';
// import { getFontStyle } from '@portkey/trader-util';
import { ZERO } from '../../../constants/misc';
// import { useMobile } from 'utils/isMobile';
// import clsx from 'clsx';
// import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';

interface Props extends Omit<InputProps, 'onChange'> {
  token?: Currency;
  tokens?: { currency?: Currency }[];
  balance?: BigNumber;
  hideUSD?: boolean;
  maxCallback?: (val: string) => void;
  onChange?: (val: string) => void;
  suffix?: React.ReactNode | string | undefined;
  hidBlance?: boolean;
  value?: string;
  showMax?: boolean;
  gasFee?: string | number;
  title?: string;
  usdSuffix?: React.ReactNode;
  className?: string;
}
export default function SwapInputRow(props: Props) {
  const {
    // token,
    // onChange,
    value,
    placeholder = '0.00',
    suffix = '',
    hideUSD = false,
    hidBlance = false,
    disabled = false,
    // balance,
    showMax = false,
    // gasFee,
    title = '',
    // usdSuffix,
    className,
  } = props;
  // const { t } = useTranslation();
  // TODO
  // const isMobile = useMobile();
  const isMobile = false;

  // const inputRef = useRef<InputRef>(null);
  // const { isConnected } = useConnectWallet();

  // const tokenPrice = useTokenPrice({
  //   symbol: token?.symbol,
  // });

  // const displayBalance = useMemo(() => {
  //   if (!balance || !isConnected) return '-';
  //   return unitConverter(divDecimals(balance || ZERO, token?.decimals), 8);
  // }, [balance, isConnected, token?.decimals]);

  // const min = useRef<BigNumber>(divDecimals('1', token?.decimals));

  // const setValue = useCallback(
  //   (_value: string) => {
  //     onChange && onChange(parseInputChange(_value, min.current, token?.decimals));
  //   },
  //   [token, onChange],
  // );

  // const onInputChange = useCallback(
  //   (event: React.ChangeEvent<HTMLInputElement>) => {
  //     if (event.target.value && !isValidNumber(event.target.value)) {
  //       return;
  //     }
  //     setValue(event.target.value);
  //   },
  //   [setValue],
  // );

  const renderUsd = useMemo(() => {
    if (value === undefined || value === '')
      return (
        <Font size={isMobile ? 12 : 14} color="two">
          -
        </Font>
      );

    return (
      <>
        {/* <PriceUSDDigits
          wrapperClassName="swap-input-price-wrap"
          // className={getFontStyle({ size: isMobile ? 12 : 14, color: 'two' })}
          price={1}
          // price={ZERO.plus(value).times(tokenPrice)}
        /> */}
        {/* {usdSuffix} */}
      </>
    );
  }, [value, isMobile]);

  // const onMax = useCallback(() => {
  //   if (token?.symbol === 'ELF' && gasFee && balance) {
  //     const _valueBN = balance.minus(gasFee);
  //     if (_valueBN.lte(ZERO)) {
  //       setValue('0');
  //       return;
  //     }
  //     setValue(divDecimals(_valueBN, token?.decimals).toFixed() || '');
  //     return;
  //   }
  //   setValue(divDecimals(balance || ZERO, token?.decimals).toFixed() || '');
  // }, [balance, gasFee, setValue, token?.decimals, token?.symbol]);

  return (
    <div
      className={clsx('swap-input-row', className)}
      // onClick={() => inputRef.current?.focus()}
    >
      <Font color="two" lineHeight={22} size={14}>
        {title}
      </Font>

      <Row gutter={[0, 12]} justify="space-between">
        <Col span={24}>
          <CommonInput
            suffix={suffix}
            value={value ?? ''}
            placeholder={placeholder}
            className="swap-input"
            disabled={!'token' || disabled}
          />
        </Col>
      </Row>

      <div className="swap-input-row-footer flex">
        <div>{!hideUSD && renderUsd}</div>
        <div>
          {!hidBlance && (
            <div className="balance-box flex">
              <Font size={14} color="two" lineHeight={20}>
                {`${'Balance'}: ${'123.12'}`}
              </Font>
              {showMax && <Button className="max-btn">MAX</Button>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
