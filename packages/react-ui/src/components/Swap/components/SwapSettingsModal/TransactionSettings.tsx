import { useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import clsx from 'clsx';
import CommonTooltip from '../../../CommonTooltip';
import { useTranslation } from 'react-i18next';
import { priceImpactList } from './config';
import Font from '../../../Font';
import CommonInput from '../../../CommonInput';
import CommonSwitch from '../../../CommonSwitch';
import BigNumber from 'bignumber.js';
import { timesDecimals } from '@portkey/trader-utils';

export default function TransactionSettings() {
  const { t } = useTranslation();

  const isMobile = false;
  const [userSlippageTolerance, setUserSlippageTolerance] = useState('0.5');

  const [inputVal, setInputVal] = useState('0');

  const inputChange = useCallback((value: string) => {
    if (!value) {
      setUserSlippageTolerance('');
      return;
    }
    if (/^(0|[1-9][0-9]{0,1})(\.[0-9]{0,2})?$/.test(value)) {
      if (/\.$/.test(value)) {
        setInputVal(value);
        return;
      }

      const realVal = new BigNumber(value).div(100).toString();
      setUserSlippageTolerance(realVal);
    }
  }, []);

  useEffect(() => {
    // if (!userSlippageTolerance) {
    //   setInputVal('');
    //   return;
    // }

    // const bigUserSlippageTolerance = new BigNumber(userSlippageTolerance);

    const bigUserSlippageTolerance = new BigNumber(0.5);
    if (bigUserSlippageTolerance.isEqualTo(0)) {
      setInputVal('0');
      return;
    }
    setInputVal(bigUserSlippageTolerance.times(100).toString());
  }, []);

  return (
    <Row gutter={[0, 8]}>
      <Col span={24}>
        <Row gutter={[8, 0]} wrap={false}>
          {priceImpactList.map(({ value }) => (
            <Col key={value}>
              <div
                className={clsx('fee-item', {
                  'fee-item-ative': userSlippageTolerance === value,
                  'fee-item-mobile': isMobile,
                })}
                onClick={() => setUserSlippageTolerance(value)}>
                <Font
                  lineHeight={20}
                  weight="medium"
                  color={userSlippageTolerance === value ? 'primary' : 'one'}>{`${timesDecimals(
                  value,
                  2,
                ).toFixed()}%`}</Font>
              </div>
            </Col>
          ))}
          <Col flex={1}>
            <CommonInput
              suffix={<Font>%</Font>}
              className="fee-input"
              onChange={(event) => inputChange(event?.target?.value)}
              value={inputVal}
              textAlign="right"
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
