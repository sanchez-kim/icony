'use client';

import { useState } from 'react';
import { Star, Clock, ChevronDown } from 'lucide-react';
import { Icon } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface CategoryFilterProps {
  icons: Icon[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

// How many category chips to show before the "More" toggle.
const INITIAL_VISIBLE = 8;

export function CategoryFilter({ icons, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  // Count icons per category, then sort by count (descending).
  const categoryCounts = icons.reduce((acc, icon) => {
    const category = icon.category || 'other';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({ category, count }));

  const visibleCategories = expanded
    ? sortedCategories
    : sortedCategories.slice(0, INITIAL_VISIBLE);
  const hiddenCount = sortedCategories.length - INITIAL_VISIBLE;

  // Title-case a category slug for display ("arrow-icons" → "Arrow Icons").
  const formatCategory = (category: string) =>
    category
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  const chipBase =
    'px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1';

  return (
    <div className="space-y-4">
      {/* ── Collections (separate from taxonomy categories) ──────────────── */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange('all')}
          aria-pressed={selectedCategory === 'all'}
          className={`${chipBase} ${
            selectedCategory === 'all'
              ? 'bg-primary-600 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-400 shadow'
          }`}
        >
          {t.ui.all}
        </button>
        <button
          onClick={() => onCategoryChange('favorites')}
          aria-pressed={selectedCategory === 'favorites'}
          className={`${chipBase} flex items-center gap-1.5 ${
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
          aria-pressed={selectedCategory === 'recent'}
          className={`${chipBase} flex items-center gap-1.5 ${
            selectedCategory === 'recent'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 shadow'
          }`}
        >
          <Clock size={12} />
          {t.ui.recent}
        </button>
      </div>

      {/* ── Categories (taxonomy chips with counts) ──────────────────────── */}
      {sortedCategories.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t.ui.category}
          </label>
          <div className="flex flex-wrap gap-2">
            {visibleCategories.map(({ category, count }) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  aria-pressed={active}
                  className={`${chipBase} inline-flex items-center gap-1.5 ${
                    active
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-400 shadow'
                  }`}
                >
                  <span>{formatCategory(category)}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${
                      active
                        ? 'bg-white/25 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}

            {hiddenCount > 0 && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className={`${chipBase} inline-flex items-center gap-1 bg-transparent text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30`}
              >
                <span>{expanded ? t.ui.showLess : `+${hiddenCount} ${t.ui.showMore}`}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
                />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
