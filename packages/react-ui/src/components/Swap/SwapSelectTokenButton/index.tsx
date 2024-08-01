import { Row, Col } from 'antd';
import clsx from 'clsx';
import { Currency } from '@awaken/sdk-core';
import { CurrencyLogo } from '../../CurrencyLogo';
import CommonButton, { CommonButtonProps } from '../../CommonButton';
import { Pair } from '../../Pair';
// import { basicModalView } from 'contexts/useModal/actions';
// import { useModalDispatch } from 'contexts/useModal/hooks';
import Font from '../../Font';
import './styles.less';
import CommonSvg from '../../CommonSvg';
interface SelectTokenButtonProps extends CommonButtonProps {
  token?: Currency;
  setToken?: (token?: Currency) => void;
}

export default function SwapSelectTokenButton({ className, token, setToken, ...props }: SelectTokenButtonProps) {
  // const dispatch = useModalDispatch();

  // const onClick = () => dispatch(basicModalView.setSelectTokenModal.actions(true, setToken, token));

  const renderContent = () => {
    if (!token) {
      return (
        <div className="select-token-btn-label-wrap">
          <Font size={16} lineHeight={24} weight="bold" align="left">
            {'Select a token'}
          </Font>
        </div>
      );
    }

    return (
      <Row gutter={[8, 0]} align="middle">
        <Col>
          <CurrencyLogo size={24} currency={token} />
        </Col>
        <Col className="flex-center-middle">
          <Pair className="select-token-pair" symbol={token?.symbol} size={16} lineHeight={24} weight="medium" />
        </Col>
      </Row>
    );
  };

  return (
    <CommonButton type={'primary'} className={clsx('select-token-btn', className)} {...props}>
      <Row justify="space-between" align="middle" className="select-token-content">
        <Col className="select-token-middle">{renderContent()}</Col>
        <Col className="select-token-icon-col">{<CommonSvg type="icon-arrow-down" />}</Col>
      </Row>
    </CommonButton>
  );
}
