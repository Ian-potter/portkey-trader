import { useCallback } from 'react';
import './styles.less';
import CommonModal from '../../../CommonModal';
import SelectTokenList from './SelectTokenList';
import { useAwakenSwapContext } from '../../../../context/AwakenSwap';
import { swapActions } from '../../../../context/AwakenSwap/actions';
import CommonModalHeader from '../../../CommonModalHeader';
import { TTokenItem } from '../../../../types';

interface ISelectTokenModalProps {
  selectedToken?: TTokenItem;
  onConfirm?: (token?: TTokenItem) => void;
}

export default function SelectTokenModal({ onConfirm, ...props }: ISelectTokenModalProps) {
  const [{ isMobile, isSelectModalShow }, { dispatch }] = useAwakenSwapContext();

  const onCloseModal = useCallback(() => {
    dispatch(swapActions.setSelectTokenModalShow.actions(false));
  }, [dispatch]);

  const onSelectToken = useCallback(
    (token?: TTokenItem) => {
      onConfirm?.(token);
      onCloseModal();
    },
    [onCloseModal, onConfirm],
  );

  return (
    <CommonModal
      width="420px"
      showType={isMobile ? 'drawer' : 'modal'}
      height={isMobile ? '70%' : '632px'}
      open={isSelectModalShow}
      title={false}
      onCancel={() => {
        onCloseModal();
      }}
      className={isMobile ? 'select-token-modal-m' : 'select-token-modal'}>
      <div className="modal-panel">
        <div className="modal-panel-content">
          <CommonModalHeader title={'Select a Token'} showClose={true} onClose={onCloseModal} />
          <SelectTokenList {...props} onConfirm={onSelectToken} />
        </div>
      </div>
    </CommonModal>
  );
}
