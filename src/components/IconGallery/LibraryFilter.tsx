'use client';

import { useIconContext } from '../../context/IconContext';
import { useLanguage } from '../../context/LanguageContext';

type IconLibrary = 'all' | 'lucide' | 'tabler' | 'phosphor' | 'phosphor-fill' | 'heroicons' | 'heroicons-solid' | 'bootstrap' | 'radix';

interface LibraryOption {
  id: IconLibrary;
  name: string;
  nameKo: string;
}

const LIBRARY_OPTIONS: LibraryOption[] = [
  { id: 'all',            name: 'All Libraries',      nameKo: '전체' },
  { id: 'lucide',         name: 'Lucide',              nameKo: 'Lucide' },
  { id: 'tabler',         name: 'Tabler',              nameKo: 'Tabler' },
  { id: 'phosphor',       name: 'Phosphor',            nameKo: 'Phosphor' },
  { id: 'phosphor-fill',  name: 'Phosphor Filled',     nameKo: 'Phosphor (채움)' },
  { id: 'heroicons',      name: 'Heroicons',           nameKo: 'Heroicons' },
  { id: 'heroicons-solid',name: 'Heroicons Solid',     nameKo: 'Heroicons (솔리드)' },
  { id: 'bootstrap',      name: 'Bootstrap',           nameKo: 'Bootstrap' },
  { id: 'radix',          name: 'Radix',               nameKo: 'Radix' },
];

export function LibraryFilter() {
  const { selectedLibrary, setSelectedLibrary, icons } = useIconContext();
  const { t, language } = useLanguage();

  // Count icons per library
  const libraryCounts = icons.reduce((acc, icon) => {
    acc[icon.type] = (acc[icon.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalCount = icons.length;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {language === 'ko' ? '아이콘 라이브러리' : 'Icon Library'}
      </label>
      <div className="flex flex-wrap gap-2">
        {LIBRARY_OPTIONS.map((option) => {
          const count = option.id === 'all' ? totalCount : (libraryCounts[option.id] || 0);
          const isSelected = selectedLibrary === option.id;

          return (
            <button
              key={option.id}
              onClick={() => setSelectedLibrary(option.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                isSelected
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-400 shadow'
              }`}
            >
              <span>{language === 'ko' ? option.nameKo : option.name}</span>
              <span className={`text-xs ${isSelected ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'}`}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
