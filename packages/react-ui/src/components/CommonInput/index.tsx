import { Ref, useMemo, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Input, InputProps, InputRef } from 'antd';
import clsx from 'clsx';
import './index.less';
import CommonSvg from '../CommonSvg';
import { useAwakenSwapContext } from '../../context/AwakenSwap';

let blurTimer: any = null;

export interface CommonInputProps extends InputProps {
  textAlign?: 'left' | 'center' | 'right';
  resumePositionOnBlur?: boolean;
  inputRef?: Ref<InputRef>;
  wrapClassName?: string;
}

export default forwardRef(function CommonInput(
  {
    textAlign = 'left',
    className,
    wrapClassName,
    value = '',
    allowClear,
    resumePositionOnBlur = false,
    onFocus,
    onBlur,
    maxLength = 100,
    ...props
  }: CommonInputProps,
  ref,
) {
  const [scrollY, setScrollY] = useState(0);
  const [{ isMobile }] = useAwakenSwapContext();
  const inputEle = useRef<InputRef>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputEle.current?.focus();
    },
  }));

  const onFocusInternal = (e: any) => {
    if (blurTimer) {
      clearTimeout(blurTimer);
      blurTimer = null;
    }
    setScrollY(window.scrollY);
    onFocus?.(e);
  };
  const onBlurInternal = (e: any) => {
    onBlur?.(e);
    if (isMobile && resumePositionOnBlur) {
      blurTimer = setTimeout(() => {
        blurTimer = 0;
        try {
          window.scrollTo({
            top: scrollY,
            left: window.scrollX,
            behavior: 'smooth',
          });
        } catch (error) {
          console.warn(error);
        }
      }, 50);
    }
  };

  const handleFocus = () => {
    inputEle?.current?.focus();
  };

  const renderClear = useMemo(() => {
    if (!allowClear) {
      return false;
    }

    if (typeof allowClear === 'boolean') {
      return { clearIcon: <CommonSvg type={'icon-clear-input'} /> };
    }

    return allowClear;
  }, [allowClear]);

  const style = useMemo(() => {
    return clsx(
      'common-input',
      {
        'common-input-center': textAlign === 'center',
        'common-input-right': textAlign === 'right',
      },
      className,
    );
  }, [className, textAlign]);

  return (
    <span onClick={handleFocus} className={wrapClassName}>
      <Input
        className={style}
        maxLength={maxLength}
        {...props}
        onFocus={onFocusInternal}
        onBlur={onBlurInternal}
        value={value}
        max={100}
        allowClear={renderClear}
        ref={inputEle}
      />
    </span>
  );
});
