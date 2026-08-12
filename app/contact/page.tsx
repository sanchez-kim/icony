'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Mail, Bug, Library, Scale, Megaphone } from 'lucide-react';
import { IconyLogo } from '../../src/components/IconyLogo';
import { ThemeToggle } from '../../src/components/ThemeToggle';
import { LanguageSwitcher } from '../../src/components/LanguageSwitcher';
import { useLanguage } from '../../src/context/LanguageContext';

const EMAIL = 'help@iconyapp.com';

export default function ContactPage() {
  const { language } = useLanguage();
  const ko = language === 'ko';

  const topics = [
    {
      icon: Bug,
      title: ko ? '버그 신고' : 'Bug Reports',
      description: ko
        ? '아이콘이 안 보이거나, 내보내기 결과가 이상하거나, 특정 브라우저에서 동작이 다르다면 알려주세요. 사용 중인 브라우저와 아이콘 이름을 함께 적어주시면 훨씬 빨리 재현할 수 있습니다.'
        : 'Icons not rendering, exports coming out wrong, or something behaving differently in your browser? Tell us. Including your browser and the icon name helps us reproduce it much faster.',
    },
    {
      icon: Library,
      title: ko ? '아이콘 라이브러리 추가 요청' : 'Icon Library Requests',
      description: ko
        ? '현재 8개 오픈소스 라이브러리를 지원합니다. 추가했으면 하는 라이브러리가 있다면 이름과 링크를 보내주세요. MIT·ISC 등 재배포가 허용된 라이선스여야 검토가 가능합니다.'
        : 'We currently bundle 8 open-source libraries. Send the name and link of one you would like added. We can only review libraries under a license that permits redistribution, such as MIT or ISC.',
    },
    {
      icon: Scale,
      title: ko ? '라이선스 · 상업적 이용' : 'Licensing & Commercial Use',
      description: ko
        ? '아이콘은 각 원저작자의 오픈소스 라이선스(MIT 또는 ISC)를 따릅니다. 상업적 사용과 저작자 표시 범위에 대한 질문은 언제든 문의하세요.'
        : 'Icons remain under their original open-source licenses (MIT or ISC). Ask us anytime about commercial use or how much attribution your project needs.',
    },
    {
      icon: Megaphone,
      title: ko ? '제휴 · 기타 문의' : 'Partnerships & Everything Else',
      description: ko
        ? '제휴, 인용, 오탈자 제보, 그 외 어떤 이야기든 환영합니다. 서비스 개선 제안은 특히 반갑습니다.'
        : 'Partnerships, citations, typo reports, or anything else — all welcome. Suggestions for improving the tool are especially appreciated.',
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
                {ko ? '홈으로' : 'Home'}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16 max-w-3xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center">
              <Mail className="text-white" size={30} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {ko ? '문의하기' : 'Contact Us'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {ko
              ? 'Icony는 한 명이 개발하고 운영하는 서비스입니다. 보내주시는 메일은 전부 직접 읽습니다.'
              : 'Icony is built and run by one person. Every message you send is read personally.'}
          </p>
        </div>

        {/* Email card */}
        <section className="mb-12">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {ko ? '이메일로 연락하기' : 'Reach Us by Email'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-lg mx-auto">
              {ko
                ? '아래 주소로 보내주세요. 받은 메일은 순서대로 확인하고 답장드립니다. 1인 운영이라 답장이 바로 가지 못할 수 있는 점 양해 부탁드립니다.'
                : 'Write to the address below. Messages are read and answered in the order they arrive. Since Icony is run by one person, a reply may not be immediate.'}
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg"
            >
              <Mail size={18} />
              {EMAIL}
            </a>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-5">
              {ko
                ? '한국어와 영어 모두 가능합니다.'
                : 'We correspond in both English and Korean.'}
            </p>
          </div>
        </section>

        {/* Topics */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {ko ? '이런 내용을 보내주세요' : 'What to Write About'}
          </h2>
          <p className="text-gray-500 dark:text-gray-500 mb-6 text-sm">
            {ko
              ? '어떤 문의든 환영하지만, 아래 내용은 특히 도움이 됩니다.'
              : 'Anything is welcome, but these are especially useful to us.'}
          </p>
          <div className="space-y-4">
            {topics.map((topic, i) => {
              const Icon = topic.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-4 p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5">{topic.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {topic.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ first */}
        <section className="mb-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {ko ? '먼저 FAQ를 확인해보세요' : 'Check the FAQ First'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {ko
                ? '가격, 라이선스, 지원 포맷, 내보내기 방법 등 자주 받는 질문은 FAQ에 정리돼 있습니다. 답이 있다면 기다리실 필요가 없습니다.'
                : 'Pricing, licensing, supported formats, and how exporting works are all answered in the FAQ. If your answer is there, you will not have to wait for a reply.'}
            </p>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
            >
              {ko ? 'FAQ 보기' : 'Read the FAQ'}
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
            <Link href="/blog" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Blog</Link>
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
