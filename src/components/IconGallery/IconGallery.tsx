import { useState, useMemo } from 'react';
import { useIconContext } from '../../context/IconContext';
import { useIconSearch } from '../../hooks/useIconSearch';
import { IconCard } from './IconCard';
import { CategoryFilter } from './CategoryFilter';
import { LibraryFilter } from './LibraryFilter';
import { SortDropdown } from './SortDropdown';
import { FilterChips } from './FilterChips';

interface IconGalleryProps {
  searchQuery: string;
}

export function IconGallery({ searchQuery }: IconGalleryProps) {
  const { icons, selectedIcon, selectIcon, favorites, recentIcons, selectedLibrary, sortBy } = useIconContext();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // First filter by search query
  const searchFiltered = useIconSearch(icons, searchQuery);

  // Then filter by library
  const libraryFiltered = useMemo(() => {
    if (selectedLibrary === 'all') return searchFiltered;
    return searchFiltered.filter(icon => icon.type === selectedLibrary);
  }, [searchFiltered, selectedLibrary]);

  // Then filter by category
  const categoryFiltered = useMemo(() => {
    if (selectedCategory === 'favorites') {
      return libraryFiltered.filter(icon => favorites.includes(icon.id));
    }
    if (selectedCategory === 'recent') {
      return libraryFiltered.filter(icon => recentIcons.includes(icon.id));
    }
    if (selectedCategory === 'all') {
      return libraryFiltered;
    }
    return libraryFiltered.filter(icon => icon.category === selectedCategory);
  }, [libraryFiltered, selectedCategory, favorites, recentIcons]);

  // Finally apply sorting
  const filteredIcons = useMemo(() => {
    const sorted = [...categoryFiltered];

    if (selectedCategory === 'recent') {
      // Sort by recent order for recent category
      const recentMap = new Map(recentIcons.map((id, index) => [id, index]));
      sorted.sort((a, b) => (recentMap.get(a.id) || 999) - (recentMap.get(b.id) || 999));
    } else {
      // Apply selected sort option
      switch (sortBy) {
        case 'name-asc':
          sorted.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          sorted.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'recent':
          const recentMap = new Map(recentIcons.map((id, index) => [id, index]));
          sorted.sort((a, b) => {
            const aIndex = recentMap.get(a.id) ?? 999;
            const bIndex = recentMap.get(b.id) ?? 999;
            return aIndex - bIndex;
          });
          break;
        case 'popular':
          // Sort by favorites first, then by name
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

      {/* Category Filter */}
      <CategoryFilter
        icons={icons}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Results Count */}
      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {filteredIcons.length} {filteredIcons.length === 1 ? 'icon' : 'icons'} found
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 max-h-[650px] overflow-y-auto pr-2 custom-scrollbar p-1">
        {filteredIcons.map((icon) => (
          <IconCard
            key={icon.id}
            icon={icon}
            selected={selectedIcon?.id === icon.id}
            onClick={() => selectIcon(icon)}
          />
        ))}
      </div>

      {filteredIcons.length === 0 && (
        <div className="text-center py-16 text-gray-400 dark:text-gray-600">
          <p className="text-lg font-medium">No icons found</p>
          <p className="text-sm mt-2">Try different keywords or categories</p>
        </div>
      )}
    </div>
  );
}
