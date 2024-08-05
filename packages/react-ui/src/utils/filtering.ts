import { TokenInfo } from '@awaken/token-lists';
import { useMemo } from 'react';
import { TTokenItem } from '../types';

const alwaysTrue = () => true;

/**
 * Create a filter function to apply to a token for whether it matches a particular search query
 * @param search the search query to apply to the token
 */
export function createTokenFilterFunction<T extends TTokenItem | TokenInfo>(search: string): (tokens: T) => boolean {
  const lowerSearchParts = search
    .toLowerCase()
    .split(/\s+/)
    .filter((s) => s.length > 0);

  if (lowerSearchParts.length === 0) return alwaysTrue;

  const matchesSearch = (s: string): boolean => {
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0);

    return lowerSearchParts.every((p) => p.length === 0 || sParts.some((sp) => sp.startsWith(p) || sp.endsWith(p)));
  };

  return ({ symbol }: T): boolean => Boolean(symbol && matchesSearch(symbol));
}

export function filterTokens<T extends TTokenItem | TokenInfo>(tokens: T[], search: string): T[] {
  return tokens.filter(createTokenFilterFunction(search));
}

export function useSortedTokensByQuery(tokens: TTokenItem[] | undefined, searchQuery: string): TTokenItem[] {
  return useMemo(() => {
    if (!tokens) {
      return [];
    }

    const symbolMatch = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0);

    if (symbolMatch.length > 1) {
      return tokens;
    }

    const exactMatches: TTokenItem[] = [];
    const symbolSubtrings: TTokenItem[] = [];
    const rest: TTokenItem[] = [];

    // sort tokens by exact match -> subtring on symbol match -> rest
    tokens.map((token) => {
      if (token.symbol?.toLowerCase() === symbolMatch[0]) {
        return exactMatches.push(token);
      } else if (token.symbol?.toLowerCase().startsWith(searchQuery.toLowerCase().trim())) {
        return symbolSubtrings.push(token);
      } else {
        return rest.push(token);
      }
    });

    return [...exactMatches, ...symbolSubtrings, ...rest];
  }, [tokens, searchQuery]);
}
