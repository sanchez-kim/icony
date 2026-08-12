'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { IconProvider, useIconContext } from '../../src/context/IconContext';
import { useLanguage } from '../../src/context/LanguageContext';
import { Header } from '../../src/components/Header';
import { MainLayout } from '../../src/components/Layout/MainLayout';
import { OnboardingModal } from '../../src/components/OnboardingModal';
import { IconyLogo } from '../../src/components/IconyLogo';
import { ErrorBoundary } from '../../src/components/ErrorBoundary';
import Link from 'next/link';

function AppPageInner() {
  const searchParams = useSearchParams();
  const { icons, selectIcon, setColor, setSize } = useIconContext();
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check if onboarding has been completed
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('icony_onboarding_completed');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  // Color/size from URL — apply once on mount. (Independent of the icon list,
  // which streams in over several renders as libraries load.)
  const appliedParamsRef = useRef(false);
  useEffect(() => {
    if (appliedParamsRef.current) return;
    appliedParamsRef.current = true;

    const colorParam = searchParams.get('color');
    if (colorParam) setColor(`#${colorParam}`);

    const sizeParam = searchParams.get('size');
    if (sizeParam) {
      const size = parseInt(sizeParam, 10);
      if (size >= 16 && size <= 512) setSize(size);
    }
  }, [searchParams, setColor, setSize]);

  // Icon from URL — apply exactly once, as soon as it resolves. Deep-linked
  // icons may belong to a deferred library that loads seconds after mount, and
  // `icons` changes on every library load; without this guard the effect would
  // re-select on each change and repeatedly pollute the "recent" list.
  const appliedIconRef = useRef(false);
  useEffect(() => {
    if (appliedIconRef.current) return;
    const iconId = searchParams.get('icon');
    if (!iconId) return;

    const icon = icons.find((i) => i.id === iconId);
    if (icon) {
      selectIcon(icon);
      appliedIconRef.current = true;
    }
  }, [searchParams, icons, selectIcon]);

  const handleHelpClick = () => {
    setShowOnboarding(true);
  };

  return (
    <>
      <Header onHelpClick={handleHelpClick} />
      <div className="flex-1">
        <MainLayout />
      </div>
      <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '0.75rem',
            padding: '12px 16px',
          },
          success: {
            duration: 2000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 3000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}

// Rendered outside the Suspense boundary below, so it is present in the
// prerendered HTML. Everything inside <Suspense> bails out of prerendering
// because AppPageInner calls useSearchParams(), which previously left this
// route with almost no static content and no <h1> at all.
function AppIntro() {
  const { language } = useLanguage();
  const ko = language === 'ko';

  const steps = ko
    ? [
        ['아이콘 찾기', '이름으로 검색하거나 라이브러리별로 필터링해 11,000개 이상의 아이콘 중에서 고릅니다.'],
        ['모양 다듬기', '색상을 지정하고 16~512px 사이에서 크기를 정합니다. Lucide·Tabler·Phosphor·Heroicons는 선 두께도 조절할 수 있습니다.'],
        ['내보내기', 'PNG 또는 SVG로 내려받거나 SVG·JSX 코드를 복사합니다. 여러 개를 골랐다면 ZIP으로 한 번에 받습니다.'],
      ]
    : [
        ['Find an icon', 'Search by name or filter by library to pick from more than 11,000 icons.'],
        ['Shape it', 'Set the color and choose a size between 16 and 512px. Lucide, Tabler, Phosphor, and Heroicons also support stroke-width control.'],
        ['Export', 'Download as PNG or SVG, or copy the icon as SVG or JSX. Select several and take them as a ZIP.'],
      ];

  return (
    <section className="container mx-auto px-6 py-12 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {ko ? '무료 아이콘 편집기' : 'Free Icon Editor'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
          {ko
            ? 'Icony는 오픈소스 아이콘을 브라우저에서 바로 커스터마이징하고 내보내는 도구입니다. Lucide, Tabler, Phosphor, Heroicons, Bootstrap Icons, Radix Icons 등 8개 라이브러리의 아이콘 11,442개를 한 곳에서 검색하고, 색상·크기·선 두께를 조정해 PNG 또는 SVG로 저장할 수 있습니다. 가입도, 설치도, 워터마크도 없습니다.'
            : 'Icony customizes and exports open-source icons straight from your browser. Search 11,442 icons across 8 libraries — Lucide, Tabler, Phosphor, Heroicons, Bootstrap Icons, and Radix Icons — then adjust color, size, and stroke width and save as PNG or SVG. No signup, no install, no watermark.'}
        </p>

        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          {ko ? '사용법' : 'How it works'}
        </h2>
        <ol className="space-y-4 mb-8">
          {steps.map(([title, body], i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="w-7 h-7 shrink-0 rounded-full bg-primary-600 text-white text-sm font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">{title}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{body}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="text-sm text-gray-500 dark:text-gray-500 leading-relaxed">
          {ko ? (
            <>
              모든 아이콘은 MIT 또는 ISC 라이선스로 배포되어 상업적 프로젝트에도 자유롭게 쓸 수 있습니다.
              라이브러리별 설명은 <Link href="/icon-libraries" className="text-primary-600 dark:text-primary-400 hover:underline">아이콘 라이브러리</Link> 페이지에,
              자주 묻는 질문은 <Link href="/faq" className="text-primary-600 dark:text-primary-400 hover:underline">FAQ</Link>에 정리돼 있습니다.
            </>
          ) : (
            <>
              Every icon is MIT or ISC licensed, so you can use it freely in commercial work. See the{' '}
              <Link href="/icon-libraries" className="text-primary-600 dark:text-primary-400 hover:underline">icon libraries</Link> page
              for what each set is good for, or the <Link href="/faq" className="text-primary-600 dark:text-primary-400 hover:underline">FAQ</Link> for common questions.
            </>
          )}
        </p>
      </div>
    </section>
  );
}

function AppFooter() {
  const { t, language } = useLanguage();

  return (
    <footer className="container mx-auto px-6 py-12 border-t border-gray-200 dark:border-gray-800 transition-colors">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <IconyLogo size={32} />
            <span className="text-lg font-bold text-gray-700 dark:text-gray-300">Icony</span>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
            {t.landing.footer.tagline}
          </p>

          <div className="text-center space-y-3">
            <div>
              <Link
                href="/contact"
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors font-medium"
              >
                {language === 'ko' ? '문의하기' : 'Contact'}
              </Link>
              <span className="mx-2 text-gray-300 dark:text-gray-700">·</span>
              <Link
                href="/terms"
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors font-medium"
              >
                {language === 'ko' ? '이용 약관' : 'Terms & Conditions'}
              </Link>
              <span className="mx-2 text-gray-300 dark:text-gray-700">·</span>
              <Link
                href="/privacy"
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors font-medium"
              >
                {language === 'ko' ? '개인정보처리방침' : 'Privacy Policy'}
              </Link>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                {t.landing.footer.iconsBy}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-500">
                <a href="https://lucide.dev" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Lucide (ISC)</a>
                <span className="text-gray-400">•</span>
                <a href="https://tabler.io/icons" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Tabler (MIT)</a>
                <span className="text-gray-400">•</span>
                <a href="https://phosphoricons.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Phosphor (MIT)</a>
                <span className="text-gray-400">•</span>
                <a href="https://heroicons.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Heroicons (MIT)</a>
                <span className="text-gray-400">•</span>
                <a href="https://icons.getbootstrap.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Bootstrap Icons (MIT)</a>
                <span className="text-gray-400">•</span>
                <a href="https://www.radix-ui.com/icons" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">Radix Icons (MIT)</a>
              </div>
            </div>
          </div>
        </div>
    </footer>
  );
}

export default function AppPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors flex flex-col">
        <Suspense>
          <IconProvider>
            <AppPageInner />
          </IconProvider>
        </Suspense>
        <AppIntro />
        <AppFooter />
      </div>
    </ErrorBoundary>
  );
}
