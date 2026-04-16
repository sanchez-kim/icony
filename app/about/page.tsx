'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Palette, Download, Zap, Heart, Shield, Globe } from 'lucide-react';
import { IconyLogo } from '../../src/components/IconyLogo';
import { ThemeToggle } from '../../src/components/ThemeToggle';
import { LanguageSwitcher } from '../../src/components/LanguageSwitcher';
import { useLanguage } from '../../src/context/LanguageContext';

export default function AboutPage() {
  const { language } = useLanguage();

  const features = [
    {
      icon: Palette,
      title: language === 'ko' ? '색상 커스터마이징' : 'Color Customization',
      description:
        language === 'ko'
          ? '직관적인 색상 피커로 아이콘 색상을 자유롭게 변경하고 실시간으로 미리보세요.'
          : 'Change icon colors freely with an intuitive color picker and preview in real time.',
    },
    {
      icon: Download,
      title: language === 'ko' ? 'PNG & SVG 내보내기' : 'PNG & SVG Export',
      description:
        language === 'ko'
          ? '16px부터 512px까지 원하는 크기로 PNG 또는 SVG 형식으로 즉시 다운로드하세요.'
          : 'Download instantly as PNG or SVG in any size from 16px to 512px.',
    },
    {
      icon: Zap,
      title: language === 'ko' ? '빠른 탐색' : 'Fast Search',
      description:
        language === 'ko'
          ? '10,000개 이상의 아이콘을 키워드, 카테고리, 라이브러리로 즉시 검색하세요.'
          : 'Search 10,000+ icons instantly by keyword, category, or library.',
    },
    {
      icon: Heart,
      title: language === 'ko' ? '즐겨찾기' : 'Favorites',
      description:
        language === 'ko'
          ? '자주 사용하는 아이콘을 즐겨찾기에 저장하고 언제든지 빠르게 접근하세요.'
          : 'Save your frequently used icons to favorites for quick access anytime.',
    },
    {
      icon: Shield,
      title: language === 'ko' ? '프라이버시 보호' : 'Privacy First',
      description:
        language === 'ko'
          ? '계정 불필요, 데이터 수집 없음. 모든 설정은 브라우저에만 저장됩니다.'
          : 'No account required. No data collection. All settings are stored locally in your browser.',
    },
    {
      icon: Globe,
      title: language === 'ko' ? '한국어 / English' : 'Korean & English',
      description:
        language === 'ko'
          ? '한국어와 영어를 지원합니다. 언제든지 언어를 전환할 수 있습니다.'
          : 'Supports Korean and English. Switch languages anytime.',
    },
  ];

  const libraries = [
    { name: 'Lucide Icons', count: '1,539', slug: 'lucide' },
    { name: 'Tabler Icons', count: '5,986', slug: 'tabler' },
    { name: 'Phosphor Icons', count: '1,047', slug: 'phosphor' },
    { name: 'Phosphor Fill', count: '1,047', slug: 'phosphor-fill' },
    { name: 'Heroicons', count: '175', slug: 'heroicons' },
    { name: 'Heroicons Solid', count: '175', slug: 'heroicons-solid' },
    { name: 'Bootstrap Icons', count: '325', slug: 'bootstrap' },
    { name: 'Radix Icons', count: '218', slug: 'radix' },
  ];

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
                {language === 'ko' ? '홈으로' : 'Home'}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <IconyLogo size={72} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'ko' ? 'Icony 소개' : 'About Icony'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {language === 'ko'
              ? '디자이너와 개발자를 위한 무료 아이콘 커스터마이징 도구입니다.'
              : 'A free icon customization tool built for designers and developers.'}
          </p>
        </div>

        {/* Story */}
        <section className="mb-12">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
              {language === 'ko' ? '왜 만들었나요?' : 'Why Icony?'}
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              {language === 'ko' ? (
                <>
                  <p>
                    아이콘을 사용할 때마다 반복되는 과정이 있었습니다. 여러 라이브러리를 돌아다니며 아이콘을 찾고,
                    디자인 툴에서 색상을 바꾸고, 크기를 조정한 후, PNG로 내보내는 과정이죠.
                  </p>
                  <p>
                    Icony는 이 과정을 하나의 도구로 통합하기 위해 만들어졌습니다. 10,000개 이상의 아이콘을
                    한 곳에서 탐색하고, 색상과 크기를 실시간으로 커스터마이징하고, PNG 또는 SVG로 즉시 다운로드할 수 있습니다.
                  </p>
                  <p>
                    가입 불필요, 완전 무료입니다.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Every time you needed an icon, there was a familiar routine: search across multiple libraries,
                    open a design tool to change the color, export it in the right size, then move on.
                  </p>
                  <p>
                    Icony was built to consolidate this into a single tool. Browse 10,000+ icons from the most
                    popular open-source libraries, customize colors and sizes in real time, and export as PNG or SVG instantly.
                  </p>
                  <p>
                    No account needed. Completely free.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {language === 'ko' ? '주요 기능' : 'Features'}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-4 p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">{feature.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Libraries */}
        <section className="mb-12">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {language === 'ko' ? '지원 아이콘 라이브러리' : 'Supported Icon Libraries'}
            </h2>
            <p className="text-gray-500 dark:text-gray-500 mb-6 text-sm">
              {language === 'ko'
                ? '모든 아이콘은 MIT 또는 ISC 라이선스로 상업적 이용이 가능합니다.'
                : 'All icons are MIT or ISC licensed and free for commercial use.'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {libraries.map((lib) => (
                <Link
                  key={lib.slug}
                  href={`/icon-libraries/${lib.slug}`}
                  className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-700 border border-transparent transition-all text-center group"
                >
                  <div className="font-semibold text-sm text-gray-800 dark:text-gray-200 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                    {lib.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{lib.count} icons</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Open source note */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              {language === 'ko' ? '완전 무료로 사용하세요' : '100% Free to Use'}
            </h2>
            <p className="text-primary-100 mb-6 max-w-xl mx-auto">
              {language === 'ko'
                ? 'Icony는 영원히 무료입니다. 가입 없이, 제한 없이 사용하세요. 아이콘도 모두 오픈소스 라이선스입니다.'
                : 'Icony is free forever. No signup, no limits. All icons are open-source licensed.'}
            </p>
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary-700 rounded-xl font-bold hover:bg-primary-50 transition-colors shadow-lg"
            >
              {language === 'ko' ? '지금 시작하기' : 'Get Started'}
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-500">
          <Link href="/" className="flex items-center gap-2 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            <IconyLogo size={20} />
            <span className="font-semibold">Icony</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/icon-libraries" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Libraries</Link>
            <Link href="/faq" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">FAQ</Link>
            <Link href="/terms" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
