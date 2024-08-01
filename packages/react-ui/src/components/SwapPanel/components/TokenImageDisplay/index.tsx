import clsx from 'clsx';
import { useMemo, useState } from 'react';
import './index.less';

interface TokenImageDisplayProps {
  src?: string;
  className?: string;
  key?: string;
  width?: number;
  symbol?: string;
}

export default function TokenImageDisplay({ src, symbol = 'ELF', width = 32, className }: TokenImageDisplayProps) {
  const [isError, setError] = useState<boolean>(true);

  const isShowDefault = useMemo(() => isError || !src, [isError, src]);

  return (
    <div className={clsx('token-img-wrapper portkey-swap-flex-center', className)} style={{ width, height: width }}>
      <div
        className={clsx('show-name-index', 'portkey-swap-flex-center', !isShowDefault && 'hidden')}
        style={{ width, height: width }}>
        {symbol?.slice(0, 1)}
      </div>
      <img
        key={src}
        className={clsx('show-image', isShowDefault && 'hidden')}
        src={src}
        onLoad={(e) => {
          setError(false);
          if (!(e.target as any).src.includes('brokenImg')) {
            (e.target as HTMLElement).className = 'show-image';
          }
        }}
        onError={() => {
          setError(true);
        }}
      />
    </div>
  );
}
