import clsx from 'clsx';
import './styles.less';
import SwapPanel from './components/SwapPanel/';
import { AwakenSwapProvider } from '../../context/AwakenSwap';

export enum SwapComponentUiType {
  Mobile = 'Mobile',
  Web = 'Web',
}

interface ISwapProps {
  containerClassName?: string;
  componentUiType?: SwapComponentUiType;
}

export const Swap = ({ componentUiType, containerClassName }: ISwapProps) => {
  return (
    <AwakenSwapProvider>
      <div className={clsx(['swap-page', containerClassName])}>
        {componentUiType === SwapComponentUiType.Mobile ? <SwapPanel /> : <SwapPanel />}
      </div>
    </AwakenSwapProvider>
  );
};

export default Swap;
