'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Copy, Check, Clock, Lightbulb } from 'lucide-react';
import { IconyLogo } from '../../../src/components/IconyLogo';
import { ThemeToggle } from '../../../src/components/ThemeToggle';
import { LanguageSwitcher } from '../../../src/components/LanguageSwitcher';
import {
  getBlogPost,
  CATEGORY_LABEL,
  type BlogBlock,
  type BlogPost,
} from '../../../src/data/blog-content';

function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group my-5">
      <pre className="bg-gray-950 dark:bg-gray-900 text-gray-100 rounded-xl p-5 text-sm overflow-x-auto font-mono leading-relaxed border border-gray-800">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all opacity-0 group-hover:opacity-100"
        aria-label={`Copy ${language} code`}
      >
        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
      </button>
    </div>
  );
}

/** Renders inline **bold** and `code` spans within authored text. */
function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-gray-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-primary-700 dark:text-primary-300 text-[0.9em] font-mono"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 scroll-mt-24">
          {block.text}
        </h2>
      );
    case 'p':
      return (
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed my-4">
          {renderInline(block.text)}
        </p>
      );
    case 'ul':
      return (
        <ul className="my-4 space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol className="my-4 space-y-2 list-decimal list-inside marker:text-primary-500 marker:font-bold">
          {block.items.map((item, i) => (
            <li key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed pl-1">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
    case 'code':
      return <CodeBlock code={block.code} language={block.lang} />;
    case 'tip':
      return (
        <div className="my-6 flex gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800/50">
          <Lightbulb size={18} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
            {renderInline(block.text)}
          </p>
        </div>
      );
    default:
      return null;
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const post = getBlogPost(slug);

  if (!post) notFound();

  const related = post.related
    .map((s) => getBlogPost(s))
    .filter((p): p is BlogPost => Boolean(p));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    dateModified: post.updated,
    author: { '@type': 'Organization', name: 'Icony' },
    publisher: { '@type': 'Organization', name: 'Icony' },
    mainEntityOfPage: `https://iconyapp.com/blog/${post.slug}`,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
                href="/blog"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <ArrowLeft size={15} />
                All Guides
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-primary-600 transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-300 truncate">{post.title}</span>
        </nav>

        {/* Article header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
            <span className="px-2.5 py-1 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-semibold">
              {CATEGORY_LABEL[post.category]}
            </span>
            <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-500">
              <Clock size={14} />
              {post.readingMinutes} min read
            </span>
            <span className="text-gray-400 dark:text-gray-600">·</span>
            <span className="text-gray-500 dark:text-gray-500">Updated {formatDate(post.updated)}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            {post.description}
          </p>
        </div>

        {/* Article body */}
        <article className="mb-12">
          {post.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </article>

        {/* CTA */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Try it in Icony</h2>
            <p className="text-white/80 mb-6">
              Search 10,000+ open-source icons, customize color, size, and stroke, then copy or download as SVG, PNG, or a React component — free.
            </p>
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Open the icon customizer
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Related guides</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="flex items-start justify-between gap-3 p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="text-xs font-semibold text-primary-600 dark:text-primary-400 mb-1">
                      {CATEGORY_LABEL[r.category]}
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
                      {r.title}
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-primary-500 transition-colors shrink-0 mt-1" />
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
            <Link href="/blog" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Blog</Link>
            <Link href="/icon-libraries" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Libraries</Link>
            <Link href="/about" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">About</Link>
            <Link href="/terms" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
