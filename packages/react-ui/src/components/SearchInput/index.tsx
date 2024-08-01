import CommonInput, { CommonInputProps } from '../CommonInput';

// import { IconSearch } from 'assets/icons';

export default function SearchInput({ placeholder = 'Search', ...props }: CommonInputProps) {
  return <CommonInput placeholder={placeholder} prefix={<div />} allowClear {...props} />;
}
