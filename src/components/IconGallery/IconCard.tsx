'use client';

import React from 'react';
import { Star, Check } from 'lucide-react';
import { Icon } from '../../types';
import { cn } from '../../utils/cn';
import { useIconContext } from '../../context/IconContext';
import { useLanguage } from '../../context/LanguageContext';

interface IconCardProps {
  icon: Icon;
  selected: boolean;
  onClick: () => void;
  /** When true, the card is part of a multi-select batch flow. */
  selectionMode?: boolean;
  /** Whether this icon is in the current batch selection. */
  batchSelected?: boolean;
}

/**
 * Renders the icon component with props appropriate for the library.
 * Falls back to a generic render (className only) for unknown libraries
 * so new libraries work without code changes.
 */
function renderIconComponent(
  icon: Icon,
  className: string,
): React.ReactElement | null {
  const comp = icon.component;
  // Detect the lazy-loading placeholder by its explicit displayName.
  if (comp.displayName === 'IconPlaceholder') {
    return (
      <div className={cn(className, 'rounded bg-gray-200 dark:bg-gray-700 animate-pulse')} />
    );
  }

  const type = icon.type;

  if (type === 'lucide') {
    return React.createElement(comp, {
      className,
      strokeWidth: 1.5,
    });
  }

  if (type === 'tabler') {
    return React.createElement(comp, {
      className,
      stroke: 1.5,
    });
  }

  if (type === 'phosphor') {
    return React.createElement(comp, {
      className,
      weight: 'regular',
    });
  }

  if (type === 'phosphor-fill') {
    return React.createElement(comp, {
      className,
      weight: 'fill',
    });
  }

  // heroicons, heroicons-solid, bootstrap, radix, and any future library
  return React.createElement(comp, {
    className,
  });
}

export const IconCard = React.memo(function IconCard({
  icon,
  selected,
  onClick,
  selectionMode = false,
  batchSelected = false,
}: IconCardProps) {
  const { isFavorite, toggleFavorite } = useIconContext();
  const { t } = useLanguage();
  const favorite = isFavorite(icon.id);

  const handleFavoriteClick = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    toggleFavorite(icon.id);
  };

  // In selection mode the highlight follows the batch pick, not the customize target.
  const highlighted = selectionMode ? batchSelected : selected;

  return (
    // Wrapper so the favorite toggle is a *sibling* button, not nested inside
    // the select button (interactive-in-button is invalid HTML and breaks
    // keyboard/screen-reader use).
    <div className="relative group h-20 w-full">
      <button
        onClick={onClick}
        className={cn(
          'h-20 w-full flex items-center justify-center border-2 rounded-xl transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          highlighted
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 shadow-lg ring-2 ring-primary-400'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50/50 dark:hover:bg-primary-900/20'
        )}
        title={icon.name}
        aria-label={selectionMode ? `Toggle ${icon.name} icon` : `Select ${icon.name} icon`}
        aria-pressed={highlighted}
      >
        {selectionMode && (
          // Checkbox indicator (top-left) for batch selection
          <span
            className={cn(
              'absolute top-1 left-1 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200',
              batchSelected
                ? 'bg-primary-600 border-primary-600 text-white'
                : 'bg-white/80 dark:bg-gray-900/80 border-gray-300 dark:border-gray-600'
            )}
            aria-hidden="true"
          >
            {batchSelected && <Check size={12} strokeWidth={3} />}
          </span>
        )}
        {renderIconComponent(icon, 'w-9 h-9 text-gray-700 dark:text-gray-300')}
      </button>

      {!selectionMode && (
        <button
          type="button"
          onClick={handleFavoriteClick}
          // Visible on hover AND keyboard focus, so it's reachable without a mouse.
          className="absolute top-1 right-1 p-1 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 z-10"
          aria-label={favorite ? t.ui.removeFromFavorites : t.ui.addToFavorites}
          aria-pressed={favorite}
        >
          <Star
            size={14}
            className={cn(
              'transition-all duration-200',
              favorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
            )}
          />
        </button>
      )}
    </div>
  );
});
