'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { IconyLogo } from '../../../src/components/IconyLogo';
import { ThemeToggle } from '../../../src/components/ThemeToggle';
import { LanguageSwitcher } from '../../../src/components/LanguageSwitcher';
import {
  LIBRARY_CONTENT,
  type LibrarySlug,
} from '../../../src/data/library-content';

function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="bg-gray-950 dark:bg-gray-900 text-gray-100 rounded-xl p-5 text-sm overflow-x-auto font-mono leading-relaxed border border-gray-800">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all opacity-0 group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
      </button>
    </div>
  );
}

export default function LibraryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const lib = LIBRARY_CONTENT[slug as LibrarySlug];

  if (!lib) notFound();

  const relatedLibs = lib.relatedSlugs.map((s) => LIBRARY_CONTENT[s]).filter(Boolean);

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
                href="/icon-libraries"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <ArrowLeft size={15} />
                All Libraries
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/icon-libraries" className="hover:text-primary-600 transition-colors">Icon Libraries</Link>
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-300">{lib.name}</span>
        </nav>

        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {lib.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">{lib.tagline}</p>
            </div>
            <a
              href={lib.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:border-primary-500 hover:text-primary-600 transition-all shrink-0"
            >
              Official site
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Stats badges */}
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r ${lib.color} text-white`}>
              {lib.license} License
            </span>
            <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {lib.iconCount.toLocaleString()} icons
            </span>
            <code className="px-3 py-1.5 rounded-lg text-sm font-mono bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {lib.npm}
            </code>
          </div>
        </div>

        {/* Description */}
        <section className="mb-10">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-7">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Overview</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{lib.description}</p>
          </div>
        </section>

        {/* Features */}
        <section className="mb-10">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-7">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Key Features</h2>
            <ul className="space-y-3">
              {lib.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                  <span className={`w-5 h-5 rounded-full bg-gradient-to-br ${lib.color} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Check size={11} className="text-white" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Installation */}
        <section className="mb-10">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-7">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Installation</h2>
            <CodeBlock code={lib.installCmd} language="bash" />
          </div>
        </section>

        {/* Usage */}
        <section className="mb-10">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-7">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Usage Example</h2>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-5">
              Basic React usage with {lib.name}
            </p>
            <CodeBlock code={lib.usageCode} language="tsx" />
          </div>
        </section>

        {/* Use cases */}
        <section className="mb-10">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-7">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Best For</h2>
            <div className="flex flex-wrap gap-2">
              {lib.useCases.map((useCase, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                >
                  {useCase}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-10">
          <div className={`bg-gradient-to-br ${lib.color} rounded-2xl p-8 text-center`}>
            <h2 className="text-2xl font-bold text-white mb-2">
              Explore {lib.name} in Icony
            </h2>
            <p className="text-white/80 mb-6">
              Browse all {lib.iconCount.toLocaleString()} icons, customize colors and sizes, and download as PNG or SVG — for free.
            </p>
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Open in Icony
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Related libraries */}
        {relatedLibs.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Related Libraries</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {relatedLibs.map((related) => (
                <Link
                  key={related.slug}
                  href={`/icon-libraries/${related.slug}`}
                  className="flex items-center justify-between p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {related.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-500 mt-0.5">
                      {related.iconCount.toLocaleString()} icons · {related.license}
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-primary-500 transition-colors" />
                </Link>
              ))}
            </div>
          </section>
        )}
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
          </div>
        </div>
      </footer>
    </div>
  );
}
