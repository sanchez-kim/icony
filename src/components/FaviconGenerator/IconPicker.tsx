'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AlertTriangle, Search } from 'lucide-react';
import type { Icon } from '../../types';
import type { LibraryKey } from '../../types/icon';
import { getAvailableLibraries } from '../../data/libraries';
import { useLibraryIcons } from '../../hooks/useLibraryIcons';
import { useIconSearch } from '../../hooks/useIconSearch';
import { useLanguage } from '../../context/LanguageContext';
import { renderIconComponent } from '../IconGallery/IconCard';
import { cn } from '../../utils/cn';

/** Libraries whose glyphs are thin outlines and lose legibility at 16px. */
export const OUTLINE_LIBRARIES: ReadonlySet<LibraryKey> = new Set<LibraryKey>([
  'lucide',
  'tabler',
  'phosphor',
  'heroicons',
]);

/** Results rendered at once; the hint asks the user to narrow beyond this. */
export const PICKER_RESULT_CAP = 200;

interface IconPickerProps {
  label: string;
  library: LibraryKey;
  onLibraryChange: (library: LibraryKey) => void;
  selected: Icon | null;
  onSelect: (icon: Icon) => void;
  /** Icon id auto-selected once, after the first load, when nothing is selected. */
  defaultIconId?: string;
  /** Show the filled/outline legibility hint for the chosen library. */
  showLegibilityHint?: boolean;
}

export function IconPicker({
  label,
  library,
  onLibraryChange,
  selected,
  onSelect,
  defaultIconId,
  showLegibilityHint = false,
}: IconPickerProps) {
  const { t } = useLanguage();
  const fg = t.faviconGenerator;
  const baseId = useId();
  const [query, setQuery] = useState('');
  const { icons, isLoading, error, retry } = useLibraryIcons(library);
  const results = useIconSearch(icons, query);
  // Keep the current selection visible even when it ranks past the cap
  // (e.g. the auto-selected default, far down an alphabetical library).
  const shown = useMemo(() => {
    const head = results.slice(0, PICKER_RESULT_CAP);
    if (!selected || head.some((i) => i.id === selected.id) || !results.some((i) => i.id === selected.id)) {
      return head;
    }
    return [selected, ...head.slice(0, PICKER_RESULT_CAP - 1)];
  }, [results, selected]);
  const libraries = useMemo(() => getAvailableLibraries(), []);

  // Post-hydration default: runs on the client only, so SSR output stays fixed.
  const autoSelected = useRef(false);
  useEffect(() => {
    if (autoSelected.current || !defaultIconId || selected || icons.length === 0) return;
    const icon = icons.find((i) => i.id === defaultIconId) ?? icons[0];
    autoSelected.current = true;
    onSelect(icon);
  }, [defaultIconId, icons, selected, onSelect]);

  const isOutline = OUTLINE_LIBRARIES.has(selected?.type ?? library);

  return (
    <fieldset className="space-y-3 min-w-0">
      <legend className="text-base font-semibold text-gray-900 dark:text-white mb-1">{label}</legend>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label htmlFor={`${baseId}-lib`} className="sr-only">
            {fg.library}
          </label>
          <select
            id={`${baseId}-lib`}
            value={library}
            onChange={(e) => onLibraryChange(e.target.value as LibraryKey)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {libraries.map((lib) => (
              <option key={lib.key} value={lib.key}>
                {lib.name}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <label htmlFor={`${baseId}-q`} className="sr-only">
            {fg.search}
          </label>
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden />
          <input
            id={`${baseId}-q`}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={fg.search}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {showLegibilityHint &&
        (isOutline ? (
          <p className="flex items-start gap-2 text-xs p-2.5 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200">
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" aria-hidden />
            {fg.outlineWarning}
          </p>
        ) : (
          <p className="text-xs text-gray-500 dark:text-gray-400">{fg.filledHint}</p>
        ))}

      <div
        className="h-56 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-2"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5" aria-hidden>
            {Array.from({ length: 24 }, (_, i) => (
              <div key={i} className="aspect-square rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div role="alert" className="p-4 text-sm text-red-600 dark:text-red-400 space-y-2">
            <p>{fg.loadFailed}</p>
            <button
              type="button"
              onClick={retry}
              className="px-3 py-1.5 rounded-lg border border-red-300 dark:border-red-700 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {fg.retry}
            </button>
          </div>
        ) : shown.length === 0 ? (
          <p className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">{fg.noResults}</p>
        ) : (
          <ul className="grid grid-cols-6 sm:grid-cols-8 gap-1.5" aria-label={label}>
            {shown.map((icon) => {
              const isSelected = selected?.id === icon.id;
              return (
                <li key={icon.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(icon)}
                    aria-label={icon.name}
                    aria-pressed={isSelected}
                    title={icon.name}
                    className={cn(
                      'w-full aspect-square flex items-center justify-center rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500',
                      isSelected
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                        : 'border-transparent hover:bg-white dark:hover:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                    )}
                  >
                    {renderIconComponent(icon, 'w-6 h-6 text-gray-700 dark:text-gray-300')}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {!isLoading && results.length > PICKER_RESULT_CAP && (
        <p className="text-xs text-gray-500 dark:text-gray-400" role="status">
          {fg.narrowHint}
        </p>
      )}
    </fieldset>
  );
}
