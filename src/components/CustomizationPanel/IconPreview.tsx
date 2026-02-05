import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { LucideIcon } from 'lucide-react';
import { useIconContext } from '../../context/IconContext';
import { cn } from '../../utils/cn';

type BackgroundOption = {
  id: string;
  label: string;
  bgClass: string;
  borderClass: string;
  preview: string;
};

const BACKGROUND_OPTIONS: BackgroundOption[] = [
  {
    id: 'light',
    label: 'Light',
    bgClass: 'bg-gray-50',
    borderClass: 'border-gray-200',
    preview: 'bg-gray-50',
  },
  {
    id: 'white',
    label: 'White',
    bgClass: 'bg-white',
    borderClass: 'border-gray-300',
    preview: 'bg-white',
  },
  {
    id: 'dark',
    label: 'Dark',
    bgClass: 'bg-gray-700',
    borderClass: 'border-gray-600',
    preview: 'bg-gray-700',
  },
  {
    id: 'black',
    label: 'Black',
    bgClass: 'bg-gray-900',
    borderClass: 'border-gray-800',
    preview: 'bg-gray-900',
  },
  {
    id: 'transparent',
    label: 'Pattern',
    bgClass: 'bg-transparent',
    borderClass: 'border-gray-300',
    preview: 'bg-gradient-to-br from-gray-100 to-gray-200',
  },
];

export function IconPreview() {
  const { selectedIcon, color, size, strokeWeight } = useIconContext();
  const [background, setBackground] = useState<string>('light');

  if (!selectedIcon) return null;

  const selectedBg = BACKGROUND_OPTIONS.find((bg) => bg.id === background);

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        {selectedIcon.name}
      </div>

      <div className="flex items-center gap-2 flex-wrap justify-center">
        {BACKGROUND_OPTIONS.map((bg) => (
          <button
            key={bg.id}
            onClick={() => setBackground(bg.id)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border-2',
              background === bg.id
                ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shadow-sm'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20'
            )}
          >
            <div
              className={cn(
                'w-4 h-4 rounded border border-gray-300',
                bg.preview
              )}
            />
            {bg.label}
          </button>
        ))}
      </div>

      <div
        className={cn(
          'flex items-center justify-center rounded-2xl border shadow-sm transition-all duration-300',
          selectedBg?.bgClass,
          selectedBg?.borderClass,
          background === 'transparent' && 'checkerboard'
        )}
        style={{
          width: size + 100,
          height: size + 100,
        }}
      >
        {selectedIcon.type === 'lucide' ? (
          React.createElement(selectedIcon.component as LucideIcon, {
            size,
            color,
            strokeWidth: strokeWeight,
            className: 'transition-all duration-300',
          })
        ) : selectedIcon.type === 'tabler' ? (
          React.createElement(selectedIcon.component as React.ComponentType<any>, {
            size,
            color,
            stroke: strokeWeight,
            className: 'transition-all duration-300',
          })
        ) : selectedIcon.type === 'phosphor' ? (
          React.createElement(selectedIcon.component as React.ComponentType<any>, {
            size,
            color,
            weight: strokeWeight > 2 ? 'bold' : strokeWeight > 1.5 ? 'regular' : 'light',
            className: 'transition-all duration-300',
          })
        ) : (
          <FontAwesomeIcon
            icon={selectedIcon.component as IconDefinition}
            style={{
              width: size,
              height: size,
              color: color,
            }}
            className="transition-all duration-300"
          />
        )}
      </div>
    </div>
  );
}
