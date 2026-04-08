'use client';

import Link from 'next/link';
import { HelpCircle } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';
import { IconyLogo } from './IconyLogo';

interface HeaderProps {
  onHelpClick?: () => void;
}

export function Header({ onHelpClick }: HeaderProps) {
  const { t } = useLanguage();
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <IconyLogo size={40} />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
                {t.header.appName}
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors">
                {t.header.subtitle}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {onHelpClick && (
              <button
                onClick={onHelpClick}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label={t.header.help}
                title={t.header.help}
              >
                <HelpCircle size={20} />
              </button>
            )}
            <LanguageSwitcher />
            <ThemeToggle />
            <Link
              href="/"
              className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {t.header.backToHome}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
