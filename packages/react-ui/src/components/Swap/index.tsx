import clsx from 'clsx';
import './styles.less';
import { SwapPanel } from './SwapPanel';
import SelectTokenModal from './SelectTokenModal';
import { AwakenSwapProvider } from '../../context/AwakenSwap';

enum SwapComponentUiType {
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
        <SelectTokenModal />
      </div>
    </AwakenSwapProvider>
  );
};

export default Swap;
