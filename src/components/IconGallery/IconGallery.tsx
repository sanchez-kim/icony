'use client';

import { useState, useMemo, useRef, useEffect, useDeferredValue } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { CheckSquare, X, FileArchive, Loader2 } from 'lucide-react';
import { useIconContext } from '../../context/IconContext';
import { useLanguage } from '../../context/LanguageContext';
import { useIconSearch } from '../../hooks/useIconSearch';
import { IconCard } from './IconCard';
import { CategoryFilter } from './CategoryFilter';
import { LibraryFilter } from './LibraryFilter';
import { SortDropdown } from './SortDropdown';
import { FilterChips } from './FilterChips';
import { Icon } from '../../types';

interface IconGalleryProps {
  searchQuery: string;
}

const ITEM_HEIGHT = 92; // px — card height (80px) + gap (12px)

export function IconGallery({ searchQuery }: IconGalleryProps) {
  const {
    icons, selectedIcon, selectIcon, favorites, recentIcons, selectedLibrary, sortBy,
    selectionMode, toggleSelectionMode, selectedIds, toggleSelected, clearSelected, isSelected,
    downloadZip, isExporting,
  } = useIconContext();
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [zipFormat, setZipFormat] = useState<'svg' | 'png'>('svg');

  // ── Scroll element as state so virtualizer re-initialises when DOM mounts ──
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ── Measure container width to derive column count ─────────────────────────
  const [cols, setCols] = useState(4);

  useEffect(() => {
    if (!scrollEl) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      let c = 2;
      if (width >= 960) c = 6;
      else if (width >= 700) c = 5;
      else if (width >= 520) c = 4;
      else if (width >= 360) c = 3;
      setCols(c);
    });
    observer.observe(scrollEl);
    return () => observer.disconnect();
  }, [scrollEl]);

  // ── Filtering pipeline ────────────────────────────────────────────────────
  // useDeferredValue keeps keystrokes responsive: the input updates instantly
  // while the heavy 10k-icon scan runs against a lagged value that React can
  // interrupt if the user keeps typing.
  const deferredQuery = useDeferredValue(searchQuery);
  const isSearching = deferredQuery !== searchQuery;
  const searchFiltered = useIconSearch(icons, deferredQuery);

  const libraryFiltered = useMemo(() => {
    if (selectedLibrary === 'all') return searchFiltered;
    return searchFiltered.filter((icon) => icon.type === selectedLibrary);
  }, [searchFiltered, selectedLibrary]);

  const categoryFiltered = useMemo(() => {
    if (selectedCategory === 'favorites') {
      return libraryFiltered.filter((icon) => favorites.includes(icon.id));
    }
    if (selectedCategory === 'recent') {
      return libraryFiltered.filter((icon) => recentIcons.includes(icon.id));
    }
    if (selectedCategory === 'all') {
      return libraryFiltered;
    }
    return libraryFiltered.filter((icon) => icon.category === selectedCategory);
  }, [libraryFiltered, selectedCategory, favorites, recentIcons]);

  const filteredIcons = useMemo((): Icon[] => {
    const sorted = [...categoryFiltered];

    if (selectedCategory === 'recent') {
      const recentMap = new Map(recentIcons.map((id, index) => [id, index]));
      sorted.sort((a, b) => (recentMap.get(a.id) ?? 999) - (recentMap.get(b.id) ?? 999));
    } else {
      switch (sortBy) {
        case 'name-asc':
          sorted.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          sorted.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'recent': {
          const recentMap = new Map(recentIcons.map((id, index) => [id, index]));
          sorted.sort((a, b) => {
            const aIndex = recentMap.get(a.id) ?? 999;
            const bIndex = recentMap.get(b.id) ?? 999;
            return aIndex - bIndex;
          });
          break;
        }
        case 'popular':
          sorted.sort((a, b) => {
            const aFav = favorites.includes(a.id) ? 0 : 1;
            const bFav = favorites.includes(b.id) ? 0 : 1;
            if (aFav !== bFav) return aFav - bFav;
            return a.name.localeCompare(b.name);
          });
          break;
      }
    }

    return sorted;
  }, [categoryFiltered, sortBy, selectedCategory, recentIcons, favorites]);

  // ── Virtual rows ──────────────────────────────────────────────────────────
  const rowCount = Math.ceil(filteredIcons.length / cols);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollEl,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 3,
  });

  return (
    <div className="space-y-4">
      {/* Library Filter and Sort Dropdown */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        <div className="flex-1 w-full">
          <LibraryFilter />
        </div>
        <div className="w-full sm:w-auto">
          <SortDropdown />
        </div>
      </div>

      {/* Active Filter Chips */}
      <FilterChips />

      {/* Category Filter — scoped to currently active library filter */}
      <CategoryFilter
        icons={libraryFiltered}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Results Count + Selection toggle */}
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {filteredIcons.length} {filteredIcons.length === 1 ? 'icon' : 'icons'} found
        </div>
        <button
          onClick={toggleSelectionMode}
          aria-pressed={selectionMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            selectionMode
              ? 'bg-primary-600 text-white shadow'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {selectionMode ? <X size={14} /> : <CheckSquare size={14} />}
          <span>{t.ui.select}</span>
        </button>
      </div>

      {/* Batch export bar */}
      {selectionMode && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
          <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
            {language === 'ko' ? `${selectedIds.length}개 선택됨` : `${selectedIds.length} selected`}
          </span>

          {/* Format toggle */}
          <div className="flex rounded-lg overflow-hidden border border-primary-300 dark:border-primary-700">
            {(['svg', 'png'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setZipFormat(fmt)}
                className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors ${
                  zipFormat === fmt
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/40'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {selectedIds.length > 0 && (
              <button
                onClick={clearSelected}
                className="px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                {t.ui.clearSelection}
              </button>
            )}
            <button
              onClick={() => downloadZip(zipFormat)}
              disabled={selectedIds.length === 0 || isExporting}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-bold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {isExporting ? <Loader2 size={14} className="animate-spin" /> : <FileArchive size={14} />}
              <span>{t.ui.exportZip}</span>
            </button>
          </div>
        </div>
      )}

      {/* Virtualized icon grid */}
      <div
        ref={(node) => { setScrollEl(node); containerRef.current = node; }}
        className="max-h-[650px] overflow-y-auto pr-2 custom-scrollbar p-1"
        style={{ opacity: isSearching ? 0.6 : 1, transition: 'opacity 150ms ease' }}
      >
        {filteredIcons.length === 0 ? (
          <div className="text-center py-16 text-gray-400 dark:text-gray-600">
            <p className="text-lg font-medium">No icons found</p>
            <p className="text-sm mt-2">Try different keywords or categories</p>
          </div>
        ) : (
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const startIndex = virtualRow.index * cols;
              const rowIcons = filteredIcons.slice(startIndex, startIndex + cols);

              return (
                <div
                  key={virtualRow.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    transform: `translateY(${virtualRow.start}px)`,
                    display: 'grid',
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                    gap: '0.75rem',
                    paddingBottom: '0.75rem',
                  }}
                >
                  {rowIcons.map((icon) => (
                    <IconCard
                      key={icon.id}
                      icon={icon}
                      selected={selectedIcon?.id === icon.id}
                      selectionMode={selectionMode}
                      batchSelected={isSelected(icon.id)}
                      onClick={() =>
                        selectionMode ? toggleSelected(icon.id) : selectIcon(icon)
                      }
                    />
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
