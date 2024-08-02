import clsx from 'clsx';
import { ChangeEventHandler, useCallback, useMemo, useState } from 'react';
import useDebounce from '../../../../hooks/useDebounce';
import { filterTokens, useSortedTokensByQuery } from '../../../../utils/filtering';
import CurrencyRow from './CurrencyRow';
import { useTokenComparator } from './sorting';
import SearchInput from '../../../SearchInput';
import CommonList from '../../../CommonList';
import { ZERO } from '../../../../constants/misc';
import { TTokenItem } from '../../../../types';
import { useIsMobile } from '../../../../hooks/device';
import { useTokenList } from '../../../../hooks/tokenList';
import './styles.less';

interface SelectTokenListProps {
  selectedToken?: TTokenItem;
  onConfirm?: (token?: TTokenItem) => void;
}

export default function SelectTokenList(props: SelectTokenListProps) {
  const isMobile = useIsMobile();
  const allTokens = useTokenList();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [invertSearchOrder] = useState<boolean>(false);

  const debouncedQuery = useDebounce(searchQuery, 200);
  const tokenComparator = useTokenComparator(invertSearchOrder, {});

  const filteredTokens: TTokenItem[] = useMemo(() => {
    return filterTokens(allTokens, debouncedQuery);
  }, [allTokens, debouncedQuery]);

  const sortedTokens: TTokenItem[] = useMemo(() => {
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
            <CurrencyRow key={item.address} currency={item} balance={ZERO} isBalanceShow={false} {...props} />
          )}
          loading={false}
          pageNum={1}
        />
      </div>
    </div>
  );
}
