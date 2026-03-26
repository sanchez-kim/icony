import React from 'react';
import { LucideIcon, Star } from 'lucide-react';
import { Icon } from '../../types';
import { cn } from '../../utils/cn';
import { useIconContext } from '../../context/IconContext';
import { useLanguage } from '../../context/LanguageContext';

interface IconCardProps {
  icon: Icon;
  selected: boolean;
  onClick: () => void;
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
  // Detect placeholder (will have displayName or be the skeleton fn)
  const name = (comp as any).displayName ?? (comp as any).name ?? '';
  if (name === 'IconPlaceholder') {
    return (
      <div className={cn(className, 'rounded bg-gray-200 dark:bg-gray-700 animate-pulse')} />
    );
  }

  const type = icon.type as string;

  if (type === 'lucide') {
    return React.createElement(comp as LucideIcon, {
      className,
      strokeWidth: 1.5,
    });
  }

  if (type === 'tabler') {
    return React.createElement(comp as React.ComponentType<any>, {
      className,
      stroke: 1.5,
    });
  }

  if (type === 'phosphor') {
    return React.createElement(comp as React.ComponentType<any>, {
      className,
      weight: 'regular',
    });
  }

  // heroicons, bootstrap, radix, and any future library
  return React.createElement(comp as React.ComponentType<any>, {
    className,
  });
}

export const IconCard = React.memo(function IconCard({
  icon,
  selected,
  onClick,
}: IconCardProps) {
  const { isFavorite, toggleFavorite } = useIconContext();
  const { t } = useLanguage();
  const favorite = isFavorite(icon.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(icon.id);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative group h-20 w-full flex items-center justify-center border-2 rounded-xl transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        selected
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 shadow-lg ring-2 ring-primary-400'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50/50 dark:hover:bg-primary-900/20'
      )}
      title={icon.name}
      aria-label={`Select ${icon.name} icon`}
      aria-pressed={selected}
    >
      <span
        onClick={handleFavoriteClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleFavoriteClick(e as any);
          }
        }}
        className="absolute top-1 right-1 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-opacity duration-200 focus:outline-none cursor-pointer"
        aria-label={favorite ? t.ui.removeFromFavorites : t.ui.addToFavorites}
      >
        <Star
          size={14}
          className={cn(
            'transition-all duration-200',
            favorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
          )}
        />
      </span>
      {renderIconComponent(icon, 'w-9 h-9 text-gray-700 dark:text-gray-300')}
    </button>
  );
});
