import { useIconContext } from '../../context/IconContext';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowUpDown } from 'lucide-react';

type SortOption = 'name-asc' | 'name-desc' | 'recent' | 'popular';

interface SortOptionItem {
  id: SortOption;
  name: string;
  nameKo: string;
}

const SORT_OPTIONS: SortOptionItem[] = [
  { id: 'name-asc', name: 'Name (A-Z)', nameKo: '이름 (가-하)' },
  { id: 'name-desc', name: 'Name (Z-A)', nameKo: '이름 (하-가)' },
  { id: 'popular', name: 'Favorites First', nameKo: '즐겨찾기 우선' },
  { id: 'recent', name: 'Recently Used', nameKo: '최근 사용' },
];

export function SortDropdown() {
  const { sortBy, setSortBy } = useIconContext();
  const { t } = useLanguage();

  const currentSort = SORT_OPTIONS.find((opt) => opt.id === sortBy);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {t.language === 'ko' ? '정렬' : 'Sort By'}
      </label>
      <div className="relative inline-block">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="appearance-none flex items-center gap-2 px-4 py-2 pr-10 rounded-lg text-sm font-semibold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {t.language === 'ko' ? option.nameKo : option.name}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
          <ArrowUpDown size={16} />
        </div>
      </div>
    </div>
  );
}
