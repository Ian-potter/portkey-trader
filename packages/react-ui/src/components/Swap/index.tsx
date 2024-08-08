import clsx from 'clsx';
import './styles.less';
import SwapPanel from './components/SwapPanel';
import { AwakenSwapProvider } from '../../context/AwakenSwap';
import { ComponentType } from '../../types';
import { ISwapProps } from '../../types/config';
import { ConfigProvider } from 'antd';

export const Swap = ({ componentUiType, containerClassName, awaken, ...props }: ISwapProps) => {
  return (
    <ConfigProvider prefixCls="portkey-trade-ant">
      <AwakenSwapProvider isMobile={componentUiType === ComponentType.Mobile} awaken={awaken}>
        <div className={clsx(['swap-page', containerClassName])}>
          {componentUiType === ComponentType.Mobile ? <SwapPanel {...props} /> : <SwapPanel {...props} />}
        </div>
      </AwakenSwapProvider>
    </ConfigProvider>
  );
};

export default Swap;
