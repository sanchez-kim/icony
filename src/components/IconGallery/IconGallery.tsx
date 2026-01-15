import { useState, useMemo } from 'react';
import { useIconContext } from '../../context/IconContext';
import { useIconSearch } from '../../hooks/useIconSearch';
import { IconCard } from './IconCard';
import { CategoryFilter } from './CategoryFilter';

interface IconGalleryProps {
  searchQuery: string;
}

export function IconGallery({ searchQuery }: IconGalleryProps) {
  const { icons, selectedIcon, selectIcon, favorites, recentIcons } = useIconContext();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // First filter by search query
  const searchFiltered = useIconSearch(icons, searchQuery);

  // Then filter by category
  const filteredIcons = useMemo(() => {
    if (selectedCategory === 'favorites') {
      return searchFiltered.filter(icon => favorites.includes(icon.id));
    }
    if (selectedCategory === 'recent') {
      // Sort by recent order
      const recentMap = new Map(recentIcons.map((id, index) => [id, index]));
      return searchFiltered
        .filter(icon => recentIcons.includes(icon.id))
        .sort((a, b) => (recentMap.get(a.id) || 999) - (recentMap.get(b.id) || 999));
    }
    if (selectedCategory === 'all') {
      return searchFiltered;
    }
    return searchFiltered.filter(icon => icon.category === selectedCategory);
  }, [searchFiltered, selectedCategory, favorites, recentIcons]);

  return (
    <div className="space-y-4">
      <CategoryFilter
        icons={icons}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {filteredIcons.length} {filteredIcons.length === 1 ? 'icon' : 'icons'} found
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[650px] overflow-y-auto pr-2 custom-scrollbar p-1">
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
