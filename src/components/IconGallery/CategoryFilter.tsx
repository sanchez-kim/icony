import { Star, Clock } from 'lucide-react';
import { Icon } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface CategoryFilterProps {
  icons: Icon[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ icons, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const { t } = useLanguage();
  // Get unique categories and count icons in each
  const categoryCounts = icons.reduce((acc, icon) => {
    const category = icon.category || 'other';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sort categories by count (descending)
  const sortedCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({ category, count }));

  // Format category name for display
  const formatCategory = (category: string) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        Category
      </label>

      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm shadow-sm transition-all duration-200"
      >
        <option value="all">All Categories ({icons.length} icons)</option>
        {sortedCategories.map(({ category, count }) => (
          <option key={category} value={category}>
            {formatCategory(category)} ({count})
          </option>
        ))}
      </select>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
            selectedCategory === 'all'
              ? 'bg-primary-600 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-400 shadow'
          }`}
        >
          All
        </button>
        <button
          onClick={() => onCategoryChange('favorites')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
            selectedCategory === 'favorites'
              ? 'bg-yellow-500 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 hover:text-yellow-700 dark:hover:text-yellow-400 shadow'
          }`}
        >
          <Star size={12} className={selectedCategory === 'favorites' ? 'fill-white' : ''} />
          {t.ui.favorites}
        </button>
        <button
          onClick={() => onCategoryChange('recent')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
            selectedCategory === 'recent'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 shadow'
          }`}
        >
          <Clock size={12} />
          {t.ui.recent}
        </button>
        {sortedCategories.slice(0, 5).map(({ category, count }) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-400 shadow'
            }`}
          >
            {formatCategory(category)}
          </button>
        ))}
      </div>
    </div>
  );
}
