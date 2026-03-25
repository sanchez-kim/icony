import { useState, useMemo, useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useIconContext } from '../../context/IconContext';
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

// Number of columns at each breakpoint — must match Tailwind grid classes below
const COLS_DEFAULT = 6; // 2xl
const ITEM_HEIGHT = 88; // px — matches p-4 card + gap

export function IconGallery({ searchQuery }: IconGalleryProps) {
  const { icons, selectedIcon, selectIcon, favorites, recentIcons, selectedLibrary, sortBy } = useIconContext();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // ── Measure the grid container to derive column count dynamically ─────────
  const containerRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(COLS_DEFAULT);

  const onResize = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      let c = 2;
      if (width >= 1536) c = 6;
      else if (width >= 1280) c = 5;
      else if (width >= 1024) c = 4;
      else if (width >= 768) c = 3;
      setCols(c);
    });
    observer.observe(node);
    (node as any).__resizeObserver = observer;
  }, []);

  const setContainerRef = useCallback((node: HTMLDivElement | null) => {
    if ((containerRef as any).current?.__resizeObserver) {
      (containerRef as any).current.__resizeObserver.disconnect();
    }
    (containerRef as any).current = node;
    if (node) onResize(node);
  }, [onResize]);

  // ── Filtering pipeline (same logic as before) ─────────────────────────────
  const searchFiltered = useIconSearch(icons, searchQuery);

  const libraryFiltered = useMemo(() => {
    if (selectedLibrary === 'all') return searchFiltered;
    return searchFiltered.filter((icon) => (icon.type as string) === selectedLibrary);
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
    getScrollElement: () => containerRef.current,
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

      {/* Results Count */}
      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {filteredIcons.length} {filteredIcons.length === 1 ? 'icon' : 'icons'} found
      </div>

      {/* Virtualized icon grid */}
      <div
        ref={setContainerRef}
        className="max-h-[650px] overflow-y-auto pr-2 custom-scrollbar p-1"
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
                      onClick={() => selectIcon(icon)}
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
