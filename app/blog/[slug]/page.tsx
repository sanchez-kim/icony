'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { IconyLogo } from '../../../src/components/IconyLogo';
import { ThemeToggle } from '../../../src/components/ThemeToggle';
import { Block } from '../../../src/components/ContentBlocks';
import { LanguageSwitcher } from '../../../src/components/LanguageSwitcher';
import { SentenceLines } from '../../../src/components/SentenceLines';
import { useLanguage } from '../../../src/context/LanguageContext';
import {
  getBlogPost,
  CATEGORY_LABEL,
  RELATED_LIBRARIES,
  type BlogLang,
  type BlogPost,
} from '../../../src/data/blog-content';
import { LIBRARY_CONTENT, type LibrarySlug } from '../../../src/data/library-content';

function formatDate(iso: string, lang: BlogLang): string {
  const d = new Date(iso);
  return d.toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { language } = useLanguage();
  const lang: BlogLang = language === 'ko' ? 'ko' : 'en';
  const post = getBlogPost(slug);

  if (!post) notFound();

  const related = post.related
    .map((s) => getBlogPost(s))
    .filter((p): p is BlogPost => Boolean(p));

  const relatedLibraries = (RELATED_LIBRARIES[post.slug] ?? [])
    .map((s) => LIBRARY_CONTENT[s as LibrarySlug])
    .filter(Boolean);

  const t = {
    home: lang === 'ko' ? '홈' : 'Home',
    blog: lang === 'ko' ? '블로그' : 'Blog',
    allGuides: lang === 'ko' ? '전체 가이드' : 'All Guides',
    readTime: lang === 'ko' ? `${post.readingMinutes}분 읽기` : `${post.readingMinutes} min read`,
    published: lang === 'ko' ? `${formatDate(post.published, lang)} 발행` : `Published ${formatDate(post.published, lang)}`,
    updated: lang === 'ko' ? `${formatDate(post.updated, lang)} 업데이트` : `Updated ${formatDate(post.updated, lang)}`,
    byline: lang === 'ko' ? 'Icony 팀' : 'Icony Team',
    related: lang === 'ko' ? '관련 가이드' : 'Related guides',
    relatedLibraries: lang === 'ko' ? '관련 아이콘 라이브러리' : 'Related icon libraries',
    ctaTitle: lang === 'ko' ? 'Icony에서 사용해 보세요' : 'Try it in Icony',
    ctaBody:
      lang === 'ko'
        ? '10,000개 이상의 오픈소스 아이콘을 검색하고 색·크기·선 두께를 조정한 뒤 SVG·PNG·React 컴포넌트로 복사하거나 다운로드하세요 — 무료.'
        : 'Search 10,000+ open-source icons, customize color, size, and stroke, then copy or download as SVG, PNG, or a React component — free.',
    ctaBtn: lang === 'ko' ? '아이콘 커스터마이저 열기' : 'Open the icon customizer',
  };

  // Article JSON-LD is emitted server-side in this route's layout.tsx.

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
                href="/blog"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <ArrowLeft size={15} />
                {t.allGuides}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary-600 transition-colors">{t.home}</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-primary-600 transition-colors">{t.blog}</Link>
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-300 truncate">{post.title[lang]}</span>
        </nav>

        {/* Article header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
            <span className="px-2.5 py-1 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-semibold">
              {CATEGORY_LABEL[post.category][lang]}
            </span>
            <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-500">
              <Clock size={14} />
              {t.readTime}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
            {post.title[lang]}
          </h1>
          <SentenceLines
            text={post.description[lang]}
            className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
          />
          {/* Byline + dates (E-E-A-T trust signals) */}
          <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500 dark:text-gray-500">
            <Link href="/about" className="font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              {t.byline}
            </Link>
            <span className="text-gray-400 dark:text-gray-600">·</span>
            <span>{t.published}</span>
            {post.updated !== post.published && (
              <>
                <span className="text-gray-400 dark:text-gray-600">·</span>
                <span>{t.updated}</span>
              </>
            )}
          </div>
        </div>

        {/* Article body */}
        <article className="mb-12">
          {post.blocks[lang].map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </article>

        {/* CTA */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">{t.ctaTitle}</h2>
            <SentenceLines text={t.ctaBody} className="text-white/80 mb-6" />
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
            >
              {t.ctaBtn}
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">{t.related}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="flex items-start justify-between gap-3 p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="text-xs font-semibold text-primary-600 dark:text-primary-400 mb-1">
                      {CATEGORY_LABEL[r.category][lang]}
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
                      {r.title[lang]}
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-primary-500 transition-colors shrink-0 mt-1" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related libraries (cross-silo internal links → reference pages) */}
        {relatedLibraries.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">{t.relatedLibraries}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {relatedLibraries.map((lib) => (
                <Link
                  key={lib.slug}
                  href={`/icon-libraries/${lib.slug}`}
                  className="flex items-start justify-between gap-3 p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
                      {lib.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-500 mt-0.5">
                      {lib.iconCount.toLocaleString()} icons · {lib.license}
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
            <Link href="/blog" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">{t.blog}</Link>
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
