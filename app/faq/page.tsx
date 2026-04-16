'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, ArrowRight } from 'lucide-react';
import { IconyLogo } from '../../src/components/IconyLogo';
import { ThemeToggle } from '../../src/components/ThemeToggle';
import { LanguageSwitcher } from '../../src/components/LanguageSwitcher';
import { useLanguage } from '../../src/context/LanguageContext';

interface FaqItem {
  question: string;
  answer: string;
}

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <span className="font-semibold text-gray-900 dark:text-white pr-4">{item.question}</span>
            <ChevronDown
              size={18}
              className={`shrink-0 text-gray-400 transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`}
            />
          </button>
          {openIndex === i && (
            <div className="px-6 pb-5 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-4">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function FaqPage() {
  const { language } = useLanguage();

  const faqs: { category: string; items: FaqItem[] }[] = language === 'ko'
    ? [
        {
          category: '일반',
          items: [
            {
              question: 'Icony는 무료인가요?',
              answer:
                '네, 완전히 무료입니다. 가입 없이 모든 기능을 사용할 수 있으며, 아이콘 다운로드에도 제한이 없습니다. 영원히 무료로 유지될 예정입니다.',
            },
            {
              question: '계정을 만들어야 하나요?',
              answer:
                '아니요. Icony는 계정이 필요 없습니다. 사이트에 접속하면 바로 모든 기능을 사용할 수 있습니다. 즐겨찾기와 최근 사용 아이콘은 브라우저에 자동 저장됩니다.',
            },
            {
              question: '개인정보는 수집하나요?',
              answer:
                '수집하지 않습니다. Icony는 서버에 어떠한 사용자 데이터도 저장하지 않습니다. 즐겨찾기, 최근 사용 아이콘, 색상 팔레트는 모두 브라우저의 로컬 스토리지에만 저장됩니다.',
            },
          ],
        },
        {
          category: '아이콘 & 라이브러리',
          items: [
            {
              question: '어떤 아이콘 라이브러리를 지원하나요?',
              answer:
                'Lucide Icons (1,539개), Tabler Icons (5,986개), Phosphor Icons (1,047개), Phosphor Fill (1,047개), Heroicons (175개), Heroicons Solid (175개), Bootstrap Icons (325개), Radix Icons (218개) — 총 10,512개의 아이콘을 지원합니다.',
            },
            {
              question: '다운로드한 아이콘을 상업적으로 사용할 수 있나요?',
              answer:
                '네. Icony가 지원하는 모든 아이콘 라이브러리는 MIT 또는 ISC 라이선스로 배포됩니다. 개인 프로젝트는 물론 상업적 프로젝트에도 자유롭게 사용할 수 있으며, 출처 표기는 법적으로 필수가 아닙니다.',
            },
            {
              question: '특정 라이브러리의 아이콘만 볼 수 있나요?',
              answer:
                '네. 앱 상단의 라이브러리 필터를 사용해 특정 라이브러리의 아이콘만 표시할 수 있습니다. Lucide, Tabler, Phosphor 등 원하는 라이브러리를 선택하면 해당 아이콘만 보여집니다.',
            },
          ],
        },
        {
          category: '커스터마이징 & 내보내기',
          items: [
            {
              question: '어떤 파일 형식으로 내보낼 수 있나요?',
              answer:
                'PNG와 SVG 두 가지 형식을 지원합니다. PNG는 비트맵 이미지로 웹, 앱, 프레젠테이션에 적합하고, SVG는 벡터 형식으로 모든 크기에서 선명하게 표시되며 코드에 직접 삽입할 수 있습니다.',
            },
            {
              question: '아이콘 크기는 어떻게 설정하나요?',
              answer:
                '슬라이더로 16px부터 512px까지 원하는 크기를 자유롭게 설정할 수 있습니다. 또는 16, 24, 32, 48, 64, 128, 256, 512px 프리셋 버튼을 사용할 수 있습니다.',
            },
            {
              question: 'SVG 코드를 직접 복사할 수 있나요?',
              answer:
                '네. 아이콘을 선택한 후 "클립보드에 복사" 버튼을 누르면 SVG 코드가 클립보드에 복사됩니다. React 컴포넌트나 HTML에 바로 붙여넣기 할 수 있습니다.',
            },
            {
              question: 'PNG와 SVG 중 어떤 형식을 써야 할까요?',
              answer:
                'SVG를 권장합니다. SVG는 어떤 크기에서도 선명하고 파일 크기가 작습니다. 단, 오래된 이메일 클라이언트나 특정 문서 도구처럼 SVG를 지원하지 않는 환경에서는 PNG를 사용하세요.',
            },
          ],
        },
        {
          category: '기술적인 질문',
          items: [
            {
              question: 'React 프로젝트에서 아이콘 라이브러리를 직접 사용할 수 있나요?',
              answer:
                '네! Icony에서 커스터마이징한 아이콘을 다운로드하거나, 각 라이브러리를 직접 npm으로 설치해 사용할 수 있습니다. 자세한 설치 방법은 /icon-libraries 페이지에서 각 라이브러리별로 확인할 수 있습니다.',
            },
            {
              question: '어떤 브라우저를 지원하나요?',
              answer:
                'Chrome, Firefox, Safari, Edge 등 최신 브라우저를 모두 지원합니다. 단, 화면 색상 스포이드(EyeDropper) 기능은 Chrome, Edge, Opera에서만 지원됩니다.',
            },
          ],
        },
      ]
    : [
        {
          category: 'General',
          items: [
            {
              question: 'Is Icony free to use?',
              answer:
                'Yes, completely free. No signup required. All features and downloads are unlimited. Icony will remain free forever.',
            },
            {
              question: 'Do I need to create an account?',
              answer:
                'No account needed. Open the site and all features are immediately available. Favorites, recent icons, and color palettes are automatically saved in your browser.',
            },
            {
              question: 'Does Icony collect any personal data?',
              answer:
                'No. Icony stores no user data on any server. Favorites, recent icons, and color palettes are stored only in your browser\'s local storage and are never transmitted anywhere.',
            },
          ],
        },
        {
          category: 'Icons & Libraries',
          items: [
            {
              question: 'Which icon libraries does Icony support?',
              answer:
                'Icony includes 8 libraries: Lucide Icons (1,539), Tabler Icons (5,986), Phosphor Icons (1,047), Phosphor Fill (1,047), Heroicons (175), Heroicons Solid (175), Bootstrap Icons (325), and Radix Icons (218) — totaling 10,512 icons.',
            },
            {
              question: 'Can I use downloaded icons commercially?',
              answer:
                'Yes. All icon libraries in Icony are distributed under MIT or ISC licenses, which allow free use in both personal and commercial projects. Attribution is not legally required, though it is appreciated.',
            },
            {
              question: 'Can I filter icons by library?',
              answer:
                'Yes. Use the library filter at the top of the app to view icons from a specific library — Lucide, Tabler, Phosphor, and more. You can also search within any library.',
            },
          ],
        },
        {
          category: 'Customization & Export',
          items: [
            {
              question: 'What file formats can I export?',
              answer:
                'PNG and SVG. PNG is a bitmap format suitable for web, apps, and presentations. SVG is a vector format that stays crisp at any size and can be embedded directly in code.',
            },
            {
              question: 'What sizes are available?',
              answer:
                'Any size from 16px to 512px using the size slider. Quick preset buttons are available for 16, 24, 32, 48, 64, 128, 256, and 512px.',
            },
            {
              question: 'Can I copy the SVG code directly?',
              answer:
                'Yes. Select an icon, then click the "Copy to Clipboard" button to copy the SVG code. You can paste it directly into React components or HTML.',
            },
            {
              question: 'Should I use PNG or SVG?',
              answer:
                'SVG is recommended in most cases — it stays sharp at any size and has a smaller file size. Use PNG for environments that don\'t support SVG, such as older email clients or certain document tools.',
            },
          ],
        },
        {
          category: 'Technical',
          items: [
            {
              question: 'Can I use these icon libraries directly in my React project?',
              answer:
                'Yes! You can download customized icons from Icony, or install the libraries directly via npm. Visit the /icon-libraries page for installation instructions and usage examples for each library.',
            },
            {
              question: 'Which browsers are supported?',
              answer:
                'All modern browsers including Chrome, Firefox, Safari, and Edge. Note: the EyeDropper (screen color picker) feature is only available in Chrome, Edge, and Opera.',
            },
          ],
        },
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

      <main className="container mx-auto px-6 py-16 max-w-3xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'ko' ? '자주 묻는 질문' : 'Frequently Asked Questions'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {language === 'ko'
              ? 'Icony 사용에 관한 궁금한 점을 모았습니다.'
              : 'Everything you need to know about using Icony.'}
          </p>
        </div>

        {/* FAQ sections */}
        <div className="space-y-10">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider text-sm">
                {section.category}
              </h2>
              <FaqAccordion items={section.items} />
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-16 p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {language === 'ko' ? '더 궁금한 점이 있으신가요?' : 'Still have questions?'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
            {language === 'ko'
              ? '직접 앱을 사용해보세요. 가입 없이 바로 시작할 수 있습니다.'
              : 'Try the app yourself — no signup required.'}
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            {language === 'ko' ? '앱 바로가기' : 'Open the App'}
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
            <Link href="/icon-libraries" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Libraries</Link>
            <Link href="/about" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">About</Link>
            <Link href="/terms" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
