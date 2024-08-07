import { ReactNode, useCallback, useMemo } from 'react';
import { Tooltip, TooltipProps } from 'antd';
import clsx from 'clsx';
import { useAwakenSwapContext } from '../../context/AwakenSwap';
import './styles.less';

export default function CommonTooltip({
  children,
  className,
  type,
  onClick,
  headerDesc,
  useTooltip = false,
  visible = false,
  title,
  buttonTitle,
  arrowPointAtCenter = true,
  align,
  placement = 'topLeft',
  width,
  ...props
}: TooltipProps & {
  onClick?: () => void;
  buttonTitle?: string;
  type?: 'light' | 'dark' | 'error';
  useTooltip?: boolean;
  headerDesc?: ReactNode;
  visible?: boolean;
  width?: string | number;
}) {
  // const modalDispatch = useModalDispatch();
  const [{ isMobile }] = useAwakenSwapContext();

  const renderChildren = useMemo(() => {
    if (!children) {
      return <span className="common-question"></span>;
    }
    return children;
  }, [children]);

  const style = useMemo(() => {
    return clsx(
      'common-tooltip',
      {
        'common-tooltip-error': type === 'error',
      },
      className,
    );
  }, [className, type]);

  const handleClick = useCallback(() => {
    if (!isMobile || useTooltip) {
      return;
    }

    if (typeof onClick === 'function') {
      return onClick();
    }
  }, [isMobile, useTooltip, onClick]);

  const renderAlign = useMemo(() => {
    if (align) {
      return align;
    }

    switch (placement) {
      case 'bottomLeft':
        return {
          offset: [-20, -10],
        };
      case 'topLeft':
        return {
          offset: [-20, -10],
        };
      case 'topRight':
        return {
          offset: [20, -10],
        };
      case 'bottomRight':
        return {
          offset: [20, -10],
        };
    }

    return undefined;
  }, [align, placement]);

  const open = useMemo(() => {
    if (useTooltip) {
      return visible;
    }

    if (isMobile) {
      return false;
    }

    return undefined;
  }, [useTooltip, isMobile, visible]);

  return (
    <Tooltip
      getPopupContainer={(triggerNode: HTMLElement) => triggerNode}
      placement={placement}
      overlayClassName={style}
      open={open}
      title={title}
      className="awk-common-tool-tip"
      arrowPointAtCenter={arrowPointAtCenter}
      autoAdjustOverflow={false}
      align={renderAlign}
      {...props}>
      <span onClick={handleClick}>{renderChildren}</span>
    </Tooltip>
  );
}
