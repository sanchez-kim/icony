import { useState, useMemo, useRef, useEffect } from 'react';
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

const ITEM_HEIGHT = 92; // px — card height (80px) + gap (12px)

export function IconGallery({ searchQuery }: IconGalleryProps) {
  const { icons, selectedIcon, selectIcon, favorites, recentIcons, selectedLibrary, sortBy } = useIconContext();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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

      {/* Results Count */}
      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {filteredIcons.length} {filteredIcons.length === 1 ? 'icon' : 'icons'} found
      </div>

      {/* Virtualized icon grid */}
      <div
        ref={(node) => { setScrollEl(node); containerRef.current = node; }}
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
