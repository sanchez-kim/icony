import { useMemo } from 'react';
import { Icon } from '../types';
import { searchIcons } from '../utils/iconSearch';

/**
 * Memoized icon search hook. All ranking/matching logic lives in the pure,
 * unit-tested `searchIcons` function (src/utils/iconSearch.ts).
 */
export function useIconSearch(icons: Icon[], query: string): Icon[] {
  return useMemo(() => searchIcons(icons, query), [icons, query]);
}
