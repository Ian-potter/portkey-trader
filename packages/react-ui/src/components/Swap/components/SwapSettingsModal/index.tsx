import { useTranslation } from 'react-i18next';
import CommonModal from '../../../CommonModal';
import TransactionSettings from './TransactionSettings';
import { useAwakenSwapContext } from '../../../../context/AwakenSwap';
import { useIsMobile } from '../../../../hooks/device';
import { swapActions } from '../../../../context/AwakenSwap/actions';
import './styles.less';
import CommonModalHeader from '../../../CommonModalHeader';
import CommonButton from '../../../CommonButton';

export default function SwapSettingsModal() {
  const { t } = useTranslation();
  const [{ isSettingModalShow }, { dispatch }] = useAwakenSwapContext();
  const isMobile = useIsMobile();

  console.log('useAwakenSwapContext', isSettingModalShow);

  const onCloseModal = () => {
    dispatch(swapActions.setSettingModalShow.actions(false));
  };

  return (
    <CommonModal
      closable
      centered
      open={isSettingModalShow}
      className="transactions-settings-modal"
      title={false}
      mask={isMobile}
      maskClosable={true}>
      <>
        <CommonModalHeader title={t('Settings')} showClose={true} onClose={onCloseModal} />
        <div className="content-wrap">
          <TransactionSettings />
          <div className="confirm-modal-btnWrap">
            <CommonButton className="confirm-modal-btn" type="primary">
              {'Save'}
            </CommonButton>
          </div>
        </div>
      </>
    </CommonModal>
  );
}
