'use client';

import { useMemo, useRef } from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);

  // "/" focuses the search from anywhere (ignored while typing in a field).
  const shortcuts = useMemo(
    () => [
      {
        key: '/',
        description: 'Focus search',
        action: () => inputRef.current?.focus(),
      },
    ],
    [],
  );
  useKeyboardShortcuts(shortcuts);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          // Escape clears the query (or blurs if already empty).
          if (e.key === 'Escape') {
            if (value) {
              e.preventDefault();
              onChange('');
            } else {
              inputRef.current?.blur();
            }
          }
        }}
        placeholder={t.ui.searchPlaceholder}
        aria-keyshortcuts="/"
        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
      />
    </div>
  );
}
