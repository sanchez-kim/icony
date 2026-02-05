import { X } from 'lucide-react';
import { useIconContext } from '../../context/IconContext';
import { useLanguage } from '../../context/LanguageContext';

const LIBRARY_NAMES: Record<string, { en: string; ko: string }> = {
  fontawesome: { en: 'Font Awesome', ko: 'Font Awesome' },
  lucide: { en: 'Lucide', ko: 'Lucide' },
  tabler: { en: 'Tabler', ko: 'Tabler' },
  phosphor: { en: 'Phosphor', ko: 'Phosphor' },
};

export function FilterChips() {
  const { selectedLibrary, setSelectedLibrary, sortBy, setSortBy } = useIconContext();
  const { t } = useLanguage();

  const hasActiveFilters = selectedLibrary !== 'all' || sortBy !== 'name-asc';

  if (!hasActiveFilters) {
    return null;
  }

  const handleClearAll = () => {
    setSelectedLibrary('all');
    setSortBy('name-asc');
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
        {t.language === 'ko' ? '활성 필터:' : 'Active Filters:'}
      </span>

      {selectedLibrary !== 'all' && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-semibold">
          <span>
            {t.language === 'ko'
              ? LIBRARY_NAMES[selectedLibrary]?.ko
              : LIBRARY_NAMES[selectedLibrary]?.en}
          </span>
          <button
            onClick={() => setSelectedLibrary('all')}
            className="hover:text-primary-900 dark:hover:text-primary-100 transition-colors"
            aria-label="Remove library filter"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {sortBy !== 'name-asc' && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">
          <span>
            {t.language === 'ko'
              ? sortBy === 'name-desc' ? '이름 (하-가)'
                : sortBy === 'popular' ? '즐겨찾기 우선'
                : '최근 사용'
              : sortBy === 'name-desc' ? 'Z-A'
                : sortBy === 'popular' ? 'Favorites'
                : 'Recent'}
          </span>
          <button
            onClick={() => setSortBy('name-asc')}
            className="hover:text-purple-900 dark:hover:text-purple-100 transition-colors"
            aria-label="Remove sort filter"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {hasActiveFilters && (
        <button
          onClick={handleClearAll}
          className="px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 underline transition-colors"
        >
          {t.language === 'ko' ? '모두 지우기' : 'Clear All'}
        </button>
      )}
    </div>
  );
}
