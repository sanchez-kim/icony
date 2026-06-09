'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { IconyLogo } from '../../src/components/IconyLogo';
import { ThemeToggle } from '../../src/components/ThemeToggle';
import { LanguageSwitcher } from '../../src/components/LanguageSwitcher';
import { BLOG_POSTS, CATEGORY_LABEL } from '../../src/data/blog-content';

export default function BlogIndexPage() {
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
            <div className="flex items-center gap-2 sm:gap-3">
              <LanguageSwitcher />
              <ThemeToggle />
              <Link
                href="/"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <ArrowLeft size={15} />
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Blog</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Practical guides, tips, and troubleshooting for working with icons and SVG —
            color, sizing, React components, and choosing the right library.
          </p>
        </div>

        {/* Post list */}
        <div className="grid sm:grid-cols-2 gap-5">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex flex-col p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-2 mb-3 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-semibold">
                  {CATEGORY_LABEL[post.category]}
                </span>
                <span className="flex items-center gap-1 text-gray-500 dark:text-gray-500">
                  <Clock size={12} />
                  {post.readingMinutes} min
                </span>
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug mb-2">
                {post.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1">
                {post.description}
              </p>
              <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-primary-600 dark:text-primary-400">
                Read guide
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ))}
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
            <Link href="/icon-libraries" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Libraries</Link>
            <Link href="/about" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">About</Link>
            <Link href="/faq" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">FAQ</Link>
            <Link href="/terms" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
