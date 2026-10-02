'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft } from 'lucide-react';
import { IconyLogo } from '../../src/components/IconyLogo';
import { ThemeToggle } from '../../src/components/ThemeToggle';
import { LanguageSwitcher } from '../../src/components/LanguageSwitcher';
import { Block } from '../../src/components/ContentBlocks';
import { useLanguage } from '../../src/context/LanguageContext';
import { FAVICON_GENERATOR_CONTENT } from '../../src/data/favicon-generator-content';

// The interactive tool is client-only and code-split: it needs canvas, the
// icon libraries and react-dom/server, none of which help the first paint.
// The server HTML gets a fixed-size placeholder (deterministic, no hydration
// mismatch) while the explanatory content below still prerenders in full.
const FaviconGenerator = dynamic(
  () => import('../../src/components/FaviconGenerator/FaviconGenerator').then((m) => m.FaviconGenerator),
  { ssr: false, loading: () => <ToolPlaceholder /> }
);

function ToolPlaceholder() {
  return (
    <div
      aria-hidden
      className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 min-h-[640px] animate-pulse"
    />
  );
}

export default function FaviconGeneratorPage() {
  const { language, t } = useLanguage();
  const blocks = FAVICON_GENERATOR_CONTENT[language];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <IconyLogo size={36} />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Icony</span>
            </Link>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <ThemeToggle />
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <ArrowLeft size={15} />
                {language === 'ko' ? '홈으로' : 'Home'}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary-600 transition-colors">{language === 'ko' ? '홈' : 'Home'}</Link>
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-300">{t.faviconGenerator.title}</span>
        </nav>

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t.faviconGenerator.title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{t.faviconGenerator.intro}</p>
        </div>

        <FaviconGenerator />

        <article className="mt-12 max-w-3xl">
          {blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </article>
      </main>

      <footer className="container mx-auto px-6 py-8 border-t border-gray-200 dark:border-gray-800 mt-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-500">
          <Link href="/" className="flex items-center gap-2 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            <IconyLogo size={20} />
            <span className="font-semibold">Icony</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/blog" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Blog</Link>
            <Link href="/icon-libraries" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Libraries</Link>
            <Link href="/favicon-generator" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Favicon Generator</Link>
            <Link href="/about" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Contact</Link>
            <Link href="/terms" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
