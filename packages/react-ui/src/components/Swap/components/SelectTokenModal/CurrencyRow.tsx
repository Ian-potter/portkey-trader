import { Currency } from '@awaken/sdk-core';
import { List, Row, Col } from 'antd';
import BigNumber from 'bignumber.js';
import { CurrencyLogo } from '../../../CurrencyLogo';
// import { useModal } from 'contexts/useModal';
import { isEqCurrency } from '../../../../utils';

import { Pair } from '../../../Pair';
import Font from '../../../Font';
import { useMemo } from 'react';
import clsx from 'clsx';
import { divDecimals } from '@portkey/trader-utils';

export interface ICurrencyRowProps {
  currency?: Currency;
  selectedToken?: Currency;
  balance?: BigNumber;
  isBalanceShow?: boolean;
  onConfirm?: (token?: Currency) => void;
}
export default function CurrencyRow({
  currency,
  selectedToken,
  balance,
  isBalanceShow = true,
  onConfirm,
}: ICurrencyRowProps) {
  const isSelected = isEqCurrency(selectedToken, currency);

  const displayBalance = useMemo(() => {
    return divDecimals(balance, currency?.decimals);
  }, [balance, currency]);

  return (
    <List.Item
      className={clsx('select-token-list-item', isSelected && 'select-token-list-item-active')}
      onClick={() => {
        if (isSelected) return;
        onConfirm?.(currency);
      }}>
      <Col span={24}>
        <Row justify="space-between" align="middle" className="select-token-list-item">
          <Col>
            <Row gutter={[8, 0]} align="middle">
              <Col className="currency-logo-col">
                <CurrencyLogo size={24} currency={currency} />
              </Col>
              <Col>
                <Pair lineHeight={24} size={16} weight="medium" symbol={currency?.symbol} />
              </Col>
            </Row>
          </Col>
          {isBalanceShow && (
            <Col>
              <Font lineHeight={24} size={16}>
                {displayBalance.toFixed()}
              </Font>
            </Col>
          )}
        </Row>
      </Col>
    </List.Item>
  );
}
