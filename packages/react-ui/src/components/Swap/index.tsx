import clsx from 'clsx';
import './styles.less';
import SwapPanel from './components/SwapPanel/';
import { AwakenSwapProvider } from '../../context/AwakenSwap';
import { AwakenSwapper } from '@portkey/trader-core';
import { ComponentType } from '../../types';

interface ISwapProps {
  containerClassName?: string;
  componentUiType?: ComponentType;
  awakenSwapInstance?: AwakenSwapper;
}

export const Swap = ({ componentUiType, containerClassName }: ISwapProps) => {
  return (
    <AwakenSwapProvider isMobile={componentUiType === ComponentType.Mobile}>
      <div className={clsx(['swap-page', containerClassName])}>
        {componentUiType === ComponentType.Mobile ? <SwapPanel /> : <SwapPanel />}
      </div>
    </AwakenSwapProvider>
  );
};

export default Swap;
