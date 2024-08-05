import './styles.less';
import CommonModal from '../../../CommonModal';
import { useAwakenSwapContext } from '../../../../context/AwakenSwap';
import { swapActions } from '../../../../context/AwakenSwap/actions';
import CommonModalHeader from '../../../CommonModalHeader';
import CommonButton from '../../../CommonButton';

export interface ISwapTipsModalParams {
  showType?: 'modal' | 'drawer' | '';
}

export default function SwapTipsModal({ showType = '' }: ISwapTipsModalParams) {
  const [{ tipsModalInfo, isTipsModalShow, isMobile }, { dispatch }] = useAwakenSwapContext();

  const onCloseModal = () => {
    dispatch(swapActions.setTipsModalShow.actions(false));
  };

  return (
    <CommonModal
      width="420px"
      height={isMobile ? 'auto' : 'auto'}
      open={isTipsModalShow}
      title={false}
      onCancel={() => {
        onCloseModal();
      }}
      centered
      showType={showType}
      className={isMobile ? 'tips-modal-m' : 'tips-modal'}>
      <div className="modal-panel">
        <CommonModalHeader title={tipsModalInfo.title} showClose={true} onClose={onCloseModal} />
        <div className="tips-content">
          <div className="info-text">{tipsModalInfo.content}</div>
          <CommonButton className="ok-btn" onClick={onCloseModal}>
            OK
          </CommonButton>
        </div>
      </div>
    </CommonModal>
  );
}
