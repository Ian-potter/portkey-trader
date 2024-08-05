import clsx from 'clsx';
import CommonInput, { CommonInputProps } from '../CommonInput';
import CommonSvg from '../CommonSvg';
import './style.less';

export default function SearchInput({ placeholder = 'Search', className, ...props }: CommonInputProps) {
  return (
    <CommonInput
      placeholder={placeholder}
      prefix={<CommonSvg type={'icon-search'} />}
      allowClear
      className={clsx(['commonSearchInput', className])}
      {...props}
    />
  );
}
