import clsx from 'clsx';
import { ChangeEventHandler, useCallback, useMemo, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import { filterTokens, useSortedTokensByQuery } from '@/utils/filtering';
import CurrencyRow from './CurrencyRow';
import { useTokenComparator } from './sorting';
import { useTranslation } from 'react-i18next';
import { Token } from '@/types';

import SearchInput from '@/components/SearchInput';
import CommonButton from '../../CommonButton';
import Font from '@/components/Font';
import CommonList from '@/components/CommonList';
// import { useAllTokenList } from 'hooks/tokenList';
import './styles.less';
import { ZERO } from '@/constants/misc';

export default function SelectTokenList({ onClickManageTokens }: { onClickManageTokens: () => void }) {
  const { t } = useTranslation();
  // const isMobile = useMobile();
  const isMobile = false;

  const allTokens = [{} as Token];
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [invertSearchOrder] = useState<boolean>(false);

  const debouncedQuery = useDebounce(searchQuery, 200);

  const tokenComparator = useTokenComparator(invertSearchOrder, {});

  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(allTokens, debouncedQuery);
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
        <SearchInput placeholder={t('selectATokenPlaceholder')} value={searchQuery} onChange={handleInput} />
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
      <div className="select-token-button-row">
        <CommonButton type="primary" onClick={onClickManageTokens} size="large">
          <Font size={16} weight="medium">
            {t('manageTokenLists')}
          </Font>
        </CommonButton>
      </div>
    </div>
  );
}
