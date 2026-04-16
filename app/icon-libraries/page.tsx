'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { IconyLogo } from '../../src/components/IconyLogo';
import { ThemeToggle } from '../../src/components/ThemeToggle';
import { LanguageSwitcher } from '../../src/components/LanguageSwitcher';
import { LIBRARY_CONTENT, ALL_LIBRARY_SLUGS } from '../../src/data/library-content';

export default function IconLibrariesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Header */}
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
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16 max-w-6xl">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-full text-xs font-semibold mb-6">
            10,000+ icons across 8 libraries
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Icon Libraries
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Icony supports 8 of the most popular open-source React icon libraries.
            All icons are free, MIT-licensed, and ready to customize.
          </p>
        </div>

        {/* Library grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {ALL_LIBRARY_SLUGS.map((slug) => {
            const lib = LIBRARY_CONTENT[slug];
            return (
              <div
                key={slug}
                className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {lib.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{lib.tagline}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r ${lib.color} text-white shrink-0 ml-3`}>
                    {lib.license}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-5 text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {lib.iconCount.toLocaleString()}
                  </span>
                  <span className="text-gray-400">icons</span>
                  <span className="text-gray-300 dark:text-gray-700">·</span>
                  <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded font-mono text-gray-700 dark:text-gray-300">
                    {lib.npm}
                  </code>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 line-clamp-2">
                  {lib.description}
                </p>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/icon-libraries/${slug}`}
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Learn more
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/app"
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Browse icons →
                  </Link>
                  <a
                    href={lib.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    aria-label="Official site"
                  >
                    <ExternalLink size={15} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center p-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl">
          <h2 className="text-2xl font-bold text-white mb-3">
            Ready to customize icons?
          </h2>
          <p className="text-primary-100 mb-6">
            Pick any icon from all 8 libraries, change colors, adjust size, and export as PNG or SVG.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary-700 rounded-xl font-bold hover:bg-primary-50 transition-colors shadow-lg"
          >
            Open Icony App
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-gray-200 dark:border-gray-800 mt-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-500">
          <Link href="/" className="flex items-center gap-2 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            <IconyLogo size={20} />
            <span className="font-semibold">Icony</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">About</Link>
            <Link href="/faq" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">FAQ</Link>
            <Link href="/terms" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
