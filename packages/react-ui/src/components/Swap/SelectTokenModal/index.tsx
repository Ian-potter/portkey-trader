import './styles.less';
import CommonModal from '../../CommonModal';
import SelectTokenList from './SelectTokenList';
import { useAwakenSwapContext } from '../../../context/AwakenSwap';
import { swapActions } from '../../../context/AwakenSwap/actions';
import CommonModalHeader from '../../CommonModalHeader';
export default function SelectTokenModal() {
  const [{ isSelectModalShow }, { dispatch }] = useAwakenSwapContext();
  const isMobile = false;

  const onCloseModal = () => {
    dispatch(swapActions.setSelectTokenModalShow.actions(false));
  };

  return (
    <CommonModal
      width="420px"
      height={isMobile ? 'auto' : '632px'}
      visible={isSelectModalShow}
      title={false}
      onCancel={() => {
        onCloseModal();
      }}
      className={isMobile ? 'select-token-modal-m' : 'select-token-modal'}>
      <div className="modal-panel">
        <div className="modal-panel-content">
          <CommonModalHeader title={'Select a Token'} showClose={true} onClose={onCloseModal} />
          <SelectTokenList />
        </div>
      </div>
    </CommonModal>
  );
}
