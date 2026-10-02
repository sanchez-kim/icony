'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Palette, Download, Zap, Heart, Shield, Globe } from 'lucide-react';
import { IconyLogo } from '../../src/components/IconyLogo';
import { ThemeToggle } from '../../src/components/ThemeToggle';
import { LanguageSwitcher } from '../../src/components/LanguageSwitcher';
import { useLanguage } from '../../src/context/LanguageContext';
import { SentenceLines } from '../../src/components/SentenceLines';

export default function AboutPage() {
  const { language } = useLanguage();

  const features = [
    {
      icon: Palette,
      title: language === 'ko' ? '색상 커스터마이징' : 'Color Customization',
      description:
        language === 'ko'
          ? '색상 피커로 아이콘 색상을 바꾸면 미리보기에 바로 반영됩니다.'
          : 'Change an icon\'s color with the picker and watch the preview update live.',
    },
    {
      icon: Download,
      title: language === 'ko' ? 'PNG & SVG 내보내기' : 'PNG & SVG Export',
      description:
        language === 'ko'
          ? '16px부터 512px까지 원하는 크기를 정해 PNG나 SVG로 바로 다운로드하세요.'
          : 'Download a PNG or SVG at any size from 16px to 512px.',
    },
    {
      icon: Zap,
      title: language === 'ko' ? '빠른 탐색' : 'Fast Search',
      description:
        language === 'ko'
          ? '10,000개가 넘는 아이콘을 키워드·카테고리·라이브러리로 바로 검색하세요.'
          : 'Search 10,000+ icons by keyword, category, or library.',
    },
    {
      icon: Heart,
      title: language === 'ko' ? '즐겨찾기' : 'Favorites',
      description:
        language === 'ko'
          ? '자주 쓰는 아이콘은 즐겨찾기에 저장해 두고 언제든 꺼내 쓰세요.'
          : 'Keep the icons you use often in your favorites, one click away.',
    },
    {
      icon: Shield,
      title: language === 'ko' ? '프라이버시 보호' : 'Privacy First',
      description:
        language === 'ko'
          ? '계정이 필요 없고 데이터도 수집하지 않습니다. 설정은 모두 브라우저에만 저장됩니다.'
          : 'You don\'t need an account, and no data is collected. Your settings are stored only in your browser.',
    },
    {
      icon: Globe,
      title: language === 'ko' ? '한국어 / English' : 'Korean & English',
      description:
        language === 'ko'
          ? '한국어와 영어를 지원하며 언어는 언제든 바꿀 수 있습니다.'
          : 'Available in Korean and English. Switch at any time.',
    },
  ];

  const libraries = [
    { name: 'Lucide Icons', count: '1,539', slug: 'lucide' },
    { name: 'Tabler Icons', count: '5,986', slug: 'tabler' },
    { name: 'Phosphor Icons', count: '1,512', slug: 'phosphor' },
    { name: 'Phosphor Fill', count: '1,512', slug: 'phosphor-fill' },
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
          <SentenceLines
            text={
              language === 'ko'
                ? '디자이너와 개발자를 위한 무료 아이콘 커스터마이징 도구입니다.'
                : 'A free icon customization tool built for designers and developers.'
            }
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          />
        </div>

        {/* Story */}
        <section className="mb-12">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
              {language === 'ko' ? '왜 만들었나요?' : 'Why Icony?'}
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              {(language === 'ko'
                ? [
                    '아이콘이 필요할 때마다 같은 과정을 되풀이했습니다. 여러 라이브러리를 돌며 아이콘을 찾고 디자인 툴에서 색상과 크기를 바꾼 다음 PNG로 내보내는 과정이죠.',
                    'Icony는 이 과정을 도구 하나로 끝내려고 만들었습니다. 10,000개가 넘는 아이콘을 한 곳에서 둘러보고 색상과 크기를 실시간으로 커스터마이징한 뒤 PNG나 SVG로 바로 다운로드할 수 있습니다.',
                    '가입할 필요 없고 완전히 무료입니다.',
                  ]
                : [
                    'Every time you needed an icon, it was the same routine. Search several libraries, open a design tool to change the color, export at the right size, then get back to work.',
                    'Icony puts all of that in one place. Browse 10,000+ icons from popular open-source libraries, change colors and sizes with a live preview, and export a PNG or SVG.',
                    "You don't need an account, and it's free.",
                  ]
              ).map((paragraph, i) => (
                <SentenceLines key={i} text={paragraph} />
              ))}
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
                    <SentenceLines as="div" text={feature.description} className="text-sm text-gray-600 dark:text-gray-400" />
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
            <SentenceLines
              text={
                language === 'ko'
                  ? '모든 아이콘이 MIT 또는 ISC 라이선스라 상업적으로도 쓸 수 있습니다.'
                  : 'Every icon is MIT or ISC licensed, so commercial use is fine.'
              }
              className="text-gray-500 dark:text-gray-500 mb-6 text-sm"
            />
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
              {language === 'ko' ? '완전히 무료입니다' : 'Free to Use'}
            </h2>
            <SentenceLines
              text={
                language === 'ko'
                  ? 'Icony는 앞으로도 무료입니다. 가입도 사용 제한도 없습니다. 아이콘 역시 모두 오픈소스 라이선스입니다.'
                  : 'Icony will stay free, with no signup and no usage limits. Every icon is under an open-source license.'
              }
              className="text-primary-100 mb-6 max-w-xl mx-auto"
            />
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary-700 rounded-xl font-bold hover:bg-primary-50 transition-colors shadow-lg"
            >
              {language === 'ko' ? '지금 시작하기' : 'Get Started'}
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Support */}
        <section className="mb-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {language === 'ko' ? '개발을 응원해 주세요' : 'Support the Project'}
            </h2>
            <SentenceLines
              text={
                language === 'ko'
                  ? 'Icony는 혼자 개발하고 운영합니다. 후원은 서비스를 유지하고 기능을 개선하는 데 큰 힘이 됩니다.'
                  : 'Icony is built and maintained by one person. Sponsorship helps keep it online and getting better.'
              }
              className="text-sm text-gray-500 dark:text-gray-500 mb-6 max-w-md mx-auto"
            />
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://buymeacoffee.com/sanchezkim7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-xl font-semibold text-sm transition-colors shadow-sm"
              >
                ☕ {language === 'ko' ? '커피 한 잔 사주기' : 'Buy Me a Coffee'}
              </a>
              <a
                href="https://github.com/sponsors/sanchez-kim"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
              >
                ♥ {language === 'ko' ? 'GitHub 후원' : 'GitHub Sponsor'}
              </a>
            </div>
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
            <Link href="/blog" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Blog</Link>
            <Link href="/icon-libraries" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Libraries</Link>
            <Link href="/favicon-generator" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Favicon Generator</Link>
            <Link href="/faq" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">FAQ</Link>
            <Link href="/contact" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Contact</Link>
            <Link href="/terms" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
