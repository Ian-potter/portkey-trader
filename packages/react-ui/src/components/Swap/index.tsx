import clsx from 'clsx';
import './styles.less';
import { SwapPanel } from './SwapPanel';

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
    <>
      <div className={clsx(['swap-page', containerClassName])}>
        {componentUiType === SwapComponentUiType.Mobile ? <SwapPanel /> : <SwapPanel />}
      </div>
    </>
  );
};

export default Swap;
