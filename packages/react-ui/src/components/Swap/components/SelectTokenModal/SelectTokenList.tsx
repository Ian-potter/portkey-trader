import clsx from 'clsx';
import { ChangeEventHandler, useCallback, useMemo, useState } from 'react';
import useDebounce from '../../../../hooks/useDebounce';
import { filterTokens, useSortedTokensByQuery } from '../../../../utils/filtering';
import CurrencyRow from './CurrencyRow';
import { useTokenComparator } from './sorting';
import { useTranslation } from 'react-i18next';
import { Token } from '@/types';

import SearchInput from '../../../SearchInput';
import CommonList from '../../../CommonList';
// import { useAllTokenList } from 'hooks/tokenList';
import './styles.less';
import { ZERO } from '../../../../constants/misc';

const mockList = [
  {
    address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
    symbol: 'ELF',
    decimals: 8,
    chainId: 'tDVW',
    id: 'b2aede10-f4e8-4d21-9e60-767cdd427f0f',
  },
  {
    address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
    symbol: 'USDC',
    decimals: 6,
    chainId: 'tDVW',
    id: 'a34e6085-c48d-4678-82de-53fd5a386b1e',
  },
  {
    address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
    symbol: 'USDC',
    decimals: 6,
    chainId: 'tDVW',
    id: 'c31025fa-3440-4b24-88e6-7f510a95439f',
  },
  {
    address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
    symbol: 'BNB',
    decimals: 8,
    chainId: 'tDVW',
    id: 'e50979b7-c818-43b9-93cf-c6a6ed4844dd',
  },
  {
    address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
    symbol: 'AWAKENNIU-12333',
    decimals: 0,
    chainId: 'tDVW',
    id: '9cab218e-85ed-4e85-bcfb-0d12401b143a',
  },
  {
    address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
    symbol: 'ZZZZZZZXZ-122',
    decimals: 0,
    chainId: 'tDVW',
    id: 'b75e8f35-800c-4324-878e-4ecbdf590b0e',
  },
  {
    address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
    symbol: 'USDT',
    decimals: 6,
    chainId: 'tDVW',
    id: '910301a7-ee78-425f-951d-60099c895ecc',
  },
  {
    address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
    symbol: 'USDT',
    decimals: 6,
    chainId: 'tDVW',
    id: 'b86854ae-7d44-41cb-a791-972f4656a04b',
  },
  {
    address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
    symbol: 'ETH',
    decimals: 8,
    chainId: 'tDVW',
    id: '0ae54eb1-427d-4b43-b70d-434c88a660bd',
  },
  {
    address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
    symbol: 'USDT',
    decimals: 6,
    chainId: 'tDVW',
    id: 'a0de1974-0295-49be-bc3a-4e5245338b4c',
  },
  {
    address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
    symbol: 'TESTSGR-1',
    decimals: 8,
    chainId: 'tDVW',
    id: '8ea52301-1e49-4565-9389-e41e99594bd4',
  },
  {
    address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
    symbol: 'ZZZZZZZXZ-999999',
    decimals: 0,
    chainId: 'tDVW',
    id: '6f0aea9f-80f6-4202-92a5-970e30ae00de',
  },
  {
    address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
    symbol: 'ZZZZZZZXZ-999999',
    decimals: 0,
    chainId: 'tDVW',
    id: '0901e311-330f-4cfc-b007-7df32d77bb71',
  },
  {
    address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
    symbol: 'KAWASAKI-400',
    decimals: 0,
    chainId: 'tDVW',
    id: '4df427dc-f615-4246-a0e0-98522f3ae3f5',
  },
  {
    address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
    symbol: 'MOUNIKAKAK',
    decimals: 0,
    chainId: 'tDVW',
    id: 'e8ec6154-c0f7-408f-bd86-bb3680df984b',
  },
  {
    address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
    symbol: 'ELEPHANT-1',
    decimals: 0,
    chainId: 'tDVW',
    id: 'e16632f5-bfb9-4327-9759-1f1eaede0dc2',
  },
  {
    address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
    symbol: 'WANGHUANBBBBB-1',
    decimals: 0,
    chainId: 'tDVW',
    id: '9202dde0-8761-440b-b2b0-ae2aa8229b92',
  },
  {
    address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
    symbol: 'CATAAAA-1',
    decimals: 8,
    chainId: 'tDVW',
    id: 'b6109e84-4aa8-4bd5-b674-15fa808ee24f',
  },
  {
    address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
    symbol: 'SGRTEST-507',
    decimals: 8,
    chainId: 'tDVW',
    id: '296099bd-1366-447d-885d-4153242da125',
  },
  {
    address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
    symbol: 'EECOTEST-4',
    decimals: 8,
    chainId: 'tDVW',
    id: '0663b8f5-6970-44bd-af4b-d41b11c261d8',
  },
  {
    address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
    symbol: 'DISK',
    decimals: 8,
    chainId: 'tDVW',
    id: 'd4557297-3ca5-455d-a08d-2f5ed1c7a138',
  },
  {
    address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
    symbol: 'SGRTEST-870',
    decimals: 8,
    chainId: 'tDVW',
    id: 'f081770a-0f05-483d-af44-c9a5ed7d5d19',
  },
  {
    address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
    symbol: 'ETH',
    decimals: 8,
    chainId: 'tDVW',
    id: 'edbb62ba-8c57-4715-96e7-6394b459317b',
  },
];

export default function SelectTokenList({ onClickManageTokens }: { onClickManageTokens?: () => void }) {
  const { t } = useTranslation();
  // const isMobile = useMobile();
  const isMobile = false;

  const allTokens = mockList;
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [invertSearchOrder] = useState<boolean>(false);

  const debouncedQuery = useDebounce(searchQuery, 200);
  const tokenComparator = useTokenComparator(invertSearchOrder, {});

  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(allTokens as unknown as Token[], debouncedQuery);
  }, [allTokens, debouncedQuery]);

  const sortedTokens: Token[] = useMemo(() => {
    return [...filteredTokens].sort(tokenComparator);
  }, [filteredTokens, tokenComparator]);

  const filteredSortedTokens = useSortedTokensByQuery(sortedTokens, debouncedQuery);

  const handleInput: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const input = event.target.value;
    setSearchQuery(input);
  }, []);

  return (
    <div className="select-token-box">
      <div className="input-row">
        <SearchInput placeholder={'Search Token'} value={searchQuery} onChange={handleInput} />
      </div>
      <div className="list-row">
        <CommonList
          className={clsx('select-token-list', !isMobile && filteredSortedTokens.length > 9 && 'token-list-large')}
          dataSource={filteredSortedTokens}
          renderItem={(item: any) => (
            <CurrencyRow key={item.address} currency={item} balance={ZERO} isBalanceShow={false} />
          )}
          loading={false}
          pageNum={1}
        />
      </div>
    </div>
  );
}
