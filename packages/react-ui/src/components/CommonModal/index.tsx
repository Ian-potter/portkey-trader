import { useMemo } from 'react';
import { Modal, ModalProps, Drawer, DrawerProps } from 'antd';
import clsx from 'clsx';
// import { useMobile } from 'utils/isMobile';
import Font, { FontProps } from '../Font';
import CommonButton from '../CommonButton';

import './index.less';

interface CommonModalProps extends ModalProps, DrawerProps {
  leftCallBack?: () => void;
  transitionName?: string;
  showBackIcon?: boolean;
  showType?: 'modal' | 'drawer' | '';
  closeOnLogin?: boolean;
  getContainer?: string | HTMLElement | (() => HTMLElement) | false;
  titleFontProps?: {
    size: FontProps['size'];
    lineHeight: FontProps['lineHeight'];
  };
  footer?: React.ReactNode;
  onClose?: (e: any) => void;
}

export default function CommonModal({
  leftCallBack,
  width = '480px',
  height = '710px',
  title = 'title',
  centered,
  className,
  onCancel,
  placement = 'bottom',
  visible = false,
  showBackIcon = true,
  closable = false,
  showType = '',
  getContainer,
  titleFontProps,
  ...props
}: CommonModalProps) {
  // const isMobile = useMobile();

  const renderTitle = useMemo(() => {
    if (!title) return null;

    let titleDom: string | null | React.ReactNode = title;

    if (typeof title === 'string') {
      titleDom = (
        <Font size={16} weight="medium" {...titleFontProps}>
          {title}
        </Font>
      );
    }

    return (
      <>
        {showBackIcon && (
          <CommonButton
            className="back-icon-btn"
            type="text"
            icon={<div>close</div>}
            onClick={leftCallBack || onCancel}
          />
        )}
        {titleDom}
        {closable && (
          <CommonButton
            className="close-icon-btn"
            type="text"
            icon={<div>close</div>}
            onClick={(e) => onCancel?.(e as any)}
          />
        )}
      </>
    );
  }, [title, showBackIcon, leftCallBack, onCancel, closable, titleFontProps]);

  const renderContent = () => {
    if (showType === 'modal') {
      return (
        <Modal
          maskClosable={false}
          centered={centered}
          destroyOnClose
          footer={null}
          width={width}
          className={clsx('common-modal', className)}
          title={renderTitle}
          closable={false}
          visible={visible}
          onCancel={onCancel}
          {...props}
        />
      );
    }

    //  if (showType === 'drawer' || 'isMobile') {
    if (showType === 'drawer') {
      const drawProps = {
        ...props,
      };
      delete drawProps.wrapProps;
      return (
        <Drawer
          maskClosable={false}
          closable={false}
          title={renderTitle}
          placement={placement}
          className={clsx('common-modal', className)}
          height={height}
          width={width}
          visible={visible}
          onClose={onCancel as any}
          {...drawProps}
        />
      );
    }

    return (
      <Modal
        getContainer={getContainer}
        maskClosable={false}
        centered={centered}
        destroyOnClose
        footer={null}
        width={width}
        className={clsx('common-modal', className)}
        title={renderTitle}
        closable={false}
        visible={visible}
        onCancel={onCancel}
        {...props}
      />
    );
  };

  return renderContent();
}
