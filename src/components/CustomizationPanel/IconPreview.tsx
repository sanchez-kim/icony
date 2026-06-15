'use client';

import React, { useState } from 'react';
import { useIconContext } from '../../context/IconContext';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../utils/cn';

const LIBRARY_INFO: Record<string, { name: string; license: string; url: string }> = {
  lucide:           { name: 'Lucide Icons',          license: 'ISC', url: 'https://lucide.dev' },
  tabler:           { name: 'Tabler Icons',           license: 'MIT', url: 'https://tabler.io/icons' },
  phosphor:         { name: 'Phosphor Icons',         license: 'MIT', url: 'https://phosphoricons.com' },
  'phosphor-fill':  { name: 'Phosphor Icons (Filled)', license: 'MIT', url: 'https://phosphoricons.com' },
  heroicons:        { name: 'Heroicons',              license: 'MIT', url: 'https://heroicons.com' },
  'heroicons-solid':{ name: 'Heroicons (Solid)',      license: 'MIT', url: 'https://heroicons.com' },
  bootstrap:        { name: 'Bootstrap Icons',        license: 'MIT', url: 'https://icons.getbootstrap.com' },
  radix:            { name: 'Radix Icons',            license: 'MIT', url: 'https://www.radix-ui.com/icons' },
};

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
  const { language } = useLanguage();
  const [background, setBackground] = useState<string>('light');

  if (!selectedIcon) return null;

  const selectedBg = BACKGROUND_OPTIONS.find((bg) => bg.id === background);
  const libInfo = LIBRARY_INFO[selectedIcon.type];

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex flex-col items-center gap-1.5">
        <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {selectedIcon.name}
        </div>
        {libInfo && (
          <a
            href={libInfo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors group"
            title={language === 'ko' ? '라이브러리 페이지 열기' : 'Open library page'}
          >
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {libInfo.name}
            </span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 font-semibold">
              {libInfo.license}
            </span>
          </a>
        )}
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
          'flex items-center justify-center rounded-2xl border shadow-sm transition-all duration-300 max-w-full mx-auto overflow-auto',
          selectedBg?.bgClass,
          selectedBg?.borderClass,
          background === 'transparent' && 'checkerboard'
        )}
        style={{
          // Cap the visual box to the available column width so large icon
          // sizes (e.g. 512px) never force horizontal page scroll on mobile;
          // the box stays square and scrolls internally if the icon is bigger.
          width: size + 100,
          aspectRatio: '1 / 1',
        }}
      >
        {selectedIcon.type === 'lucide' ? (
          React.createElement(selectedIcon.component, {
            size,
            color,
            strokeWidth: strokeWeight,
            className: 'transition-all duration-300',
          })
        ) : selectedIcon.type === 'tabler' ? (
          React.createElement(selectedIcon.component, {
            size,
            color,
            stroke: strokeWeight,
            className: 'transition-all duration-300',
          })
        ) : selectedIcon.type === 'phosphor-fill' ? (
          React.createElement(selectedIcon.component, {
            size,
            color,
            weight: 'fill',
            className: 'transition-all duration-300',
          })
        ) : selectedIcon.type === 'phosphor' ? (
          React.createElement(selectedIcon.component, {
            size,
            color,
            weight: strokeWeight > 2 ? 'bold' : strokeWeight > 1.5 ? 'regular' : 'light',
            className: 'transition-all duration-300',
          })
        ) : (
          // heroicons (outline) / heroicons-solid / bootstrap / radix.
          // strokeWidth drives Heroicons outline; no-op for fill-based libs.
          React.createElement(selectedIcon.component, {
            width: size,
            height: size,
            color,
            strokeWidth: strokeWeight,
            className: 'transition-all duration-300',
          })
        )}
      </div>
    </div>
  );
}
