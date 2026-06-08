'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../src/context/LanguageContext';
import { LanguageSwitcher } from '../../src/components/LanguageSwitcher';
import { ThemeToggle } from '../../src/components/ThemeToggle';
import { IconyLogo } from '../../src/components/IconyLogo';

export default function PrivacyPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <header className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <IconyLogo size={40} />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
                  Icony
                </h1>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <ThemeToggle />
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <ArrowLeft size={16} />
                {language === 'ko' ? '홈으로' : 'Back to Home'}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-8 md:p-12 transition-colors">
          {language === 'ko' ? (
            <>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">개인정보처리방침</h1>

              <section className="space-y-6 text-gray-700 dark:text-gray-300">
                <div>
                  <p className="leading-relaxed">
                    Icony(이하 &quot;서비스&quot;)는 이용자의 개인정보를 중요하게 생각합니다. 본 개인정보처리방침은
                    서비스가 어떤 정보를 수집하고, 쿠키 및 제3자 광고를 어떻게 활용하는지 설명합니다.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. 수집하는 정보</h2>
                  <p className="leading-relaxed mb-3">
                    Icony는 회원가입이나 로그인이 필요 없으며, 이름·이메일·전화번호 등 <strong>직접적으로 식별 가능한
                    개인정보를 수집하지 않습니다.</strong> 다만 다음 정보가 자동으로 처리될 수 있습니다:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>로컬 스토리지</strong>: 즐겨찾기·최근 사용 아이콘·테마(다크/라이트)·언어 설정은 귀하의 브라우저에만 저장되며 외부 서버로 전송되지 않습니다.</li>
                    <li><strong>접속 및 분석 데이터</strong>: 광고·분석 도구를 통해 브라우저 종류, 기기 정보, 대략적 위치, 방문 페이지 등이 익명으로 수집될 수 있습니다.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. 쿠키 및 제3자 광고 (Google AdSense)</h2>
                  <p className="leading-relaxed mb-3">
                    본 서비스는 Google AdSense를 통해 광고를 게재합니다. 이 과정에서 다음과 같이 쿠키가 사용됩니다:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Google을 포함한 제3자 공급업체는 쿠키를 사용하여 이용자의 이전 방문 기록을 바탕으로 광고를 게재합니다.</li>
                    <li>Google은 <strong>광고 쿠키(DoubleClick 쿠키 등)</strong>를 사용하여 본 사이트 및 다른 사이트 방문 기록에 기반한 맞춤형 광고를 제공합니다.</li>
                    <li>
                      이용자는{' '}
                      <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">Google 광고 설정</a>
                      에서 맞춤 광고를 비활성화하거나,{' '}
                      <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">www.aboutads.info</a>
                      에서 제3자 공급업체의 쿠키 사용을 거부할 수 있습니다.
                    </li>
                  </ul>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    ℹ️ Google의 광고 쿠키 사용에 대한 자세한 내용은{' '}
                    <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">Google 광고 정책</a>
                    을 참고하세요.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. 분석 도구</h2>
                  <p className="leading-relaxed">
                    본 서비스는 익명 트래픽 분석을 위해 Cloudflare Web Analytics를 사용할 수 있습니다. 이 도구는
                    개인을 식별하지 않으며 쿠키 없이 집계된 방문 통계만 수집합니다.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. 정보의 보관 및 제어</h2>
                  <p className="leading-relaxed">
                    로컬 스토리지에 저장된 데이터는 언제든지 브라우저의 캐시·사이트 데이터 삭제 기능을 통해 직접
                    제거할 수 있습니다. Icony는 이 데이터에 접근하거나 수집하지 않습니다.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. 아동의 개인정보</h2>
                  <p className="leading-relaxed">
                    본 서비스는 만 14세 미만 아동을 대상으로 하지 않으며, 의도적으로 아동의 개인정보를 수집하지 않습니다.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. 방침의 변경</h2>
                  <p className="leading-relaxed">
                    본 개인정보처리방침은 필요에 따라 변경될 수 있으며, 변경 시 본 페이지에 게시됩니다.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. 문의</h2>
                  <p className="leading-relaxed">
                    개인정보처리방침에 대한 문의는{' '}
                    <a href="mailto:sanchez.kim.kr@gmail.com" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">sanchez.kim.kr@gmail.com</a>
                    으로 연락해 주세요.
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    최종 업데이트: 2026년 6월 8일
                  </p>
                </div>
              </section>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>

              <section className="space-y-6 text-gray-700 dark:text-gray-300">
                <div>
                  <p className="leading-relaxed">
                    Icony (&quot;the Service&quot;) takes your privacy seriously. This Privacy Policy explains what
                    information the Service collects and how it uses cookies and third-party advertising.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Information We Collect</h2>
                  <p className="leading-relaxed mb-3">
                    Icony requires no sign-up or login and does <strong>not collect directly identifiable personal
                    information</strong> such as your name, email, or phone number. However, the following may be
                    processed automatically:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Local storage</strong>: Favorites, recent icons, theme (dark/light), and language preferences are stored only in your browser and are never sent to any external server.</li>
                    <li><strong>Access and analytics data</strong>: Advertising and analytics tools may anonymously collect data such as browser type, device information, approximate location, and pages visited.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Cookies and Third-Party Advertising (Google AdSense)</h2>
                  <p className="leading-relaxed mb-3">
                    This Service displays ads through Google AdSense. As part of this, cookies are used as follows:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits.</li>
                    <li>Google uses <strong>advertising cookies (such as the DoubleClick cookie)</strong> to serve personalized ads based on visits to this and other sites.</li>
                    <li>
                      You may opt out of personalized advertising via{' '}
                      <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">Google Ads Settings</a>,
                      or opt out of third-party vendor cookies at{' '}
                      <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">www.aboutads.info</a>.
                    </li>
                  </ul>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    ℹ️ For more details on how Google uses advertising cookies, see the{' '}
                    <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">Google Advertising Policies</a>.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Analytics</h2>
                  <p className="leading-relaxed">
                    This Service may use Cloudflare Web Analytics for anonymous traffic analysis. This tool does not
                    identify individuals and collects only aggregated visit statistics without cookies.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Data Retention and Control</h2>
                  <p className="leading-relaxed">
                    Data stored in local storage can be removed at any time by clearing your browser&apos;s cache and
                    site data. Icony does not access or collect this data.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Children&apos;s Privacy</h2>
                  <p className="leading-relaxed">
                    This Service is not directed to children under 14 and does not knowingly collect personal
                    information from children.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Changes to This Policy</h2>
                  <p className="leading-relaxed">
                    This Privacy Policy may be updated as needed. Any changes will be posted on this page.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Contact</h2>
                  <p className="leading-relaxed">
                    For questions about this Privacy Policy, please contact{' '}
                    <a href="mailto:sanchez.kim.kr@gmail.com" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">sanchez.kim.kr@gmail.com</a>.
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Last Updated: June 8, 2026
                  </p>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
