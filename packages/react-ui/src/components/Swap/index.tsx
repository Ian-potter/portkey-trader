import clsx from 'clsx';
import './styles.less';
import SwapPanel from './components/SwapPanel';
import { AwakenSwapProvider } from '../../context/AwakenSwap';
import { ComponentType } from '../../types';
import { ISwapProps } from '../../types/config';

export const Swap = ({ componentUiType, containerClassName, awaken, ...props }: ISwapProps) => {
  return (
    <AwakenSwapProvider isMobile={componentUiType === ComponentType.Mobile} awaken={awaken}>
      <div className={clsx(['swap-page', containerClassName])}>
        {componentUiType === ComponentType.Mobile ? <SwapPanel {...props} /> : <SwapPanel {...props} />}
      </div>
    </AwakenSwapProvider>
  );
};

export default Swap;
