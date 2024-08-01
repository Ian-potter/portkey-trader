import './styles.less';
import CommonModal from '../../CommonModal';
// import SelectTokenList from './SelectTokenList';
import { Carousel } from 'antd';
import { CarouselRef } from 'antd/lib/carousel';
import { useRef, useState } from 'react';
import { useAwakenSwapContext } from '../../../context/AwakenSwap';
import { swapActions } from '../../../context/AwakenSwap/actions';
export default function SelectTokenModal() {
  const [{ isSelectModalShow: selectTokenModal }, { dispatch }] = useAwakenSwapContext();
  const corousel = useRef<CarouselRef>(null);
  const [slide, setSlide] = useState(0);
  const isMobile = false;

  const onCloseModal = () => {
    setSlide(0);
    dispatch(swapActions.setSelectTokenModalShow.actions(false));
  };

  const onBack = () => {
    setSlide(0);
    corousel.current?.goTo(0);
  };

  return (
    <CommonModal
      width="420px"
      height={isMobile ? 'auto' : '632px'}
      visible={selectTokenModal}
      title={false}
      onCancel={() => {
        if (slide === 1) {
          onBack();
        } else {
          onCloseModal();
        }
      }}
      className={isMobile ? 'select-token-modal-m' : 'select-token-modal'}
      closable={slide !== 1}
      showBackIcon={slide === 1}>
      <Carousel ref={corousel} slickGoTo={slide} dots={false} autoplay={false} swipe={false}>
        <div className="modal-panel">
          <div className="modal-panel-content">
            {/* <CommonModalHeader title={t('selectAToken')} showClose={true} onClose={onCloseModal} /> */}
            {/* <SelectTokenList
              onClickManageTokens={() => {
                setSlide(1);
                corousel.current?.goTo(1);
              }}
            /> */}
          </div>
        </div>
      </Carousel>
    </CommonModal>
  );
}
