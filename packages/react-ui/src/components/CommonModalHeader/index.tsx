// import { IconArrowLeft2, IconClose } from '@/assets/icons';
import CommonButton from '../CommonButton';
import CommonSvg from '../CommonSvg';

import './index.less';

export type CommonModalHeaderProps = {
  title: string;
  showClose?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  onClose?: () => void;
};

export default function CommonModalHeader({ title, showClose, onClose }: CommonModalHeaderProps) {
  return (
    <div className="portkey-trade-ant-modal-header common-modal-header">
      <div className="portkey-trade-ant-modal-title">
        <span className="default-font-style font-weight-medium font-color-one font-size-16 line-height-undefined text-align-left">
          {title}
        </span>
        {showClose && (
          <CommonButton className="close-icon-btn" type="text" icon={<CommonSvg type={'close'} />} onClick={onClose} />
        )}
      </div>
    </div>
  );
}
