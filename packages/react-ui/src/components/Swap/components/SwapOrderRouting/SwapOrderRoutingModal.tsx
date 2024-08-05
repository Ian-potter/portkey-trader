import { useCallback } from 'react';
import CommonModal from '../../../CommonModal';
import CommonButton from '../../../CommonButton';
import './styles.less';
import { useAwakenSwapContext } from '../../../../context/AwakenSwap';
import { swapActions } from '../../../../context/AwakenSwap/actions';
import CommonModalHeader from '../../../CommonModalHeader';
import { SwapOrderRouting } from './index';
import { TPercentInfo, TSwapRoute } from '../../types';

export type SwapOrderRoutingModal = {
  swapRoute?: TSwapRoute;
  percentRoutes?: TPercentInfo[];
};

export const SwapOrderRoutingModal = (props: SwapOrderRoutingModal) => {
  const [{ isOrderRoutingModalShow }, { dispatch }] = useAwakenSwapContext();

  const closeBtn = useCallback(() => dispatch(swapActions.setOrderRoutingModalShow.actions(false)), [dispatch]);

  return (
    <CommonModal
      width="420px"
      height="522px"
      showType="modal"
      showBackIcon={false}
      centered={true}
      open={isOrderRoutingModalShow}
      title={false}
      className={'swap-confirm-modal'}
      onCancel={() => {
        dispatch(swapActions.setConfirmModalShow.actions(false));
      }}>
      <CommonModalHeader title="Order Routing" showClose onClose={closeBtn} />
      <div className="modal-content-wrap">
        <SwapOrderRouting {...props} />
        <CommonButton
          onClick={() => {
            dispatch(swapActions.setOrderRoutingModalShow.actions(false));
          }}
          className="swap-confirm-modal-btn"
          type="primary">
          {'OK'}
        </CommonButton>
      </div>
    </CommonModal>
  );
};
