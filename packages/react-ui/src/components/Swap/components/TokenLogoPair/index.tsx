import TokenImageDisplay from '../TokenImageDisplay';
import './index.less';

export interface ITokenLogoPairParams {
  token1: any;
  token2: any;
}

export default function TokenLogoPair({ token1, token2 }: ITokenLogoPairParams) {
  return (
    <div className="token-logo-pair">
      <TokenImageDisplay className="logo-pair-1" symbol={token1?.symbol} width={20} />
      <TokenImageDisplay className="logo-pair-2" symbol={token2?.symbol} width={20} />
    </div>
  );
}
