import CommonModal from '../../../CommonModal';
import { useAwakenSwapContext } from '../../../../context/AwakenSwap';
import { useIsMobile } from '../../../../hooks/device';
import { swapActions } from '../../../../context/AwakenSwap/actions';
import './styles.less';
import CommonModalHeader from '../../../CommonModalHeader';
import CommonButton from '../../../CommonButton';
import { useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { priceImpactList } from './config';
import Font from '../../../Font';
import CommonInput from '../../../CommonInput';
import BigNumber from 'bignumber.js';
import { timesDecimals } from '@portkey/trader-utils';
import CommonTooltip from '../../../CommonTooltip';

interface SwapSettingsModalProps {
  value: string;
  onConfirm: (v: string) => void;
}

export default function SwapSettingsModal(props: SwapSettingsModalProps) {
  const { value, onConfirm } = props;
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [{ isSettingModalShow }, { dispatch }] = useAwakenSwapContext();

  const [inputVal, setInputVal] = useState(value || '0');
  const [userSlippageTolerance, setUserSlippageTolerance] = useState(value || '0.005');

  const onCloseModal = useCallback(() => {
    dispatch(swapActions.setSettingModalShow.actions(false));
  }, [dispatch]);

  const onSave = useCallback(() => {
    onConfirm(userSlippageTolerance);
    onCloseModal?.();
  }, [onCloseModal, onConfirm, userSlippageTolerance]);

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
    if (!userSlippageTolerance) {
      setInputVal('');
      return;
    }

    const bigUserSlippageTolerance = new BigNumber(userSlippageTolerance);

    if (bigUserSlippageTolerance.isEqualTo(0)) {
      setInputVal('0');
      return;
    }
    setInputVal(bigUserSlippageTolerance.times(100).toString());
  }, [userSlippageTolerance]);

  return (
    <CommonModal
      closable
      centered
      open={isSettingModalShow}
      className="transactions-settings-modal"
      title={false}
      mask={isMobile}
      maskClosable={true}>
      <>
        <CommonModalHeader title={t('Settings')} showClose={true} onClose={onCloseModal} />
        <div className="content-wrap">
          <div className="tips-wrap">
            <span className="price-swap-info-label">{'Max. Slippage'}</span>
            <CommonTooltip
              placement="top"
              title={'The trade will be cancelled when slippage exceeds this percentage.'}
              getPopupContainer={(v) => v}
            />
          </div>

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
          <div className="confirm-modal-btnWrap">
            <CommonButton className="confirm-modal-btn" type="primary" onClick={onSave}>
              {'Save'}
            </CommonButton>
          </div>
        </div>
      </>
    </CommonModal>
  );
}
