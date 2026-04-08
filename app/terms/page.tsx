'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../src/context/LanguageContext';
import { LanguageSwitcher } from '../../src/components/LanguageSwitcher';
import { ThemeToggle } from '../../src/components/ThemeToggle';
import { IconyLogo } from '../../src/components/IconyLogo';

export default function TermsPage() {
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
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">이용 약관</h1>

              <section className="space-y-6 text-gray-700 dark:text-gray-300">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. 서비스 이용</h2>
                  <p className="leading-relaxed">
                    Icony는 아이콘 커스터마이징 서비스를 무료로 제공합니다. 본 서비스를 이용함으로써 귀하는 본 약관에 동의하는 것으로 간주됩니다.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. 아이콘 라이선스</h2>
                  <p className="leading-relaxed mb-4">
                    본 서비스에서 제공하는 모든 아이콘은 <strong>MIT 또는 ISC 라이선스</strong>를 따릅니다.
                    이는 상업적 이용, 수정, 배포 모두 가능하며, 출처 표기가 법적으로 요구되지 않습니다.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800">
                          <th className="text-left p-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-900 dark:text-white">라이브러리</th>
                          <th className="text-left p-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-900 dark:text-white">라이선스</th>
                          <th className="text-left p-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-900 dark:text-white">상업적 이용</th>
                          <th className="text-left p-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-900 dark:text-white">출처 표기</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'Lucide Icons', url: 'https://lucide.dev', license: 'ISC' },
                          { name: 'Tabler Icons', url: 'https://tabler.io/icons', license: 'MIT' },
                          { name: 'Phosphor Icons', url: 'https://phosphoricons.com', license: 'MIT' },
                          { name: 'Heroicons', url: 'https://heroicons.com', license: 'MIT' },
                          { name: 'Bootstrap Icons', url: 'https://icons.getbootstrap.com', license: 'MIT' },
                          { name: 'Radix Icons', url: 'https://www.radix-ui.com/icons', license: 'MIT' },
                        ].map((lib) => (
                          <tr key={lib.name} className="border-b border-gray-100 dark:border-gray-800">
                            <td className="p-3 border border-gray-200 dark:border-gray-700">
                              <a href={lib.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">{lib.name}</a>
                            </td>
                            <td className="p-3 border border-gray-200 dark:border-gray-700">
                              <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-semibold">{lib.license}</span>
                            </td>
                            <td className="p-3 border border-gray-200 dark:border-gray-700 text-green-600 dark:text-green-400 font-medium">✓ 가능</td>
                            <td className="p-3 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">권장 (필수 아님)</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    ℹ️ MIT/ISC 라이선스는 상업적 프로젝트 포함 어디서든 자유롭게 사용할 수 있습니다. 출처 표기는 법적 의무가 아니지만 오픈소스 생태계 기여 차원에서 권장됩니다.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. 사용자 책임</h2>
                  <p className="leading-relaxed mb-3">사용자는 다음 사항에 동의합니다:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>다운로드한 아이콘의 해당 라이선스(MIT/ISC) 조건을 준수할 것</li>
                    <li>아이콘을 재배포할 경우 원본 라이선스 파일을 함께 포함할 것</li>
                    <li>본 서비스를 악의적인 목적으로 사용하지 않을 것</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. 면책 조항</h2>
                  <p className="leading-relaxed">
                    본 서비스는 "있는 그대로" 제공됩니다. Icony는 서비스의 정확성, 신뢰성, 가용성에 대해 어떠한 보증도 하지 않으며,
                    서비스 이용으로 인한 직간접적 손해에 대해 책임지지 않습니다.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. 개인정보 보호</h2>
                  <p className="leading-relaxed">
                    Icony는 사용자의 개인정보를 수집하지 않습니다. 즐겨찾기 및 최근 사용 아이콘은 귀하의 브라우저 로컬 스토리지에만 저장되며,
                    외부 서버로 전송되지 않습니다.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. 서비스 변경 및 종료</h2>
                  <p className="leading-relaxed">
                    Icony는 사전 통지 없이 서비스의 일부 또는 전부를 변경하거나 종료할 수 있는 권리를 보유합니다.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. 준거법</h2>
                  <p className="leading-relaxed">
                    본 약관은 대한민국 법률에 따라 해석되고 적용됩니다.
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    최종 업데이트: 2026년 3월 26일
                  </p>
                </div>
              </section>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Terms and Conditions</h1>

              <section className="space-y-6 text-gray-700 dark:text-gray-300">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Service Usage</h2>
                  <p className="leading-relaxed">
                    Icony provides a free icon customization service. By using this service, you agree to be bound by these terms and conditions.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Icon Licenses</h2>
                  <p className="leading-relaxed mb-4">
                    All icons provided through this service are licensed under <strong>MIT or ISC licenses</strong>.
                    This permits commercial use, modification, and redistribution. Attribution is not legally required.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800">
                          <th className="text-left p-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-900 dark:text-white">Library</th>
                          <th className="text-left p-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-900 dark:text-white">License</th>
                          <th className="text-left p-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-900 dark:text-white">Commercial Use</th>
                          <th className="text-left p-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-900 dark:text-white">Attribution</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'Lucide Icons', url: 'https://lucide.dev', license: 'ISC' },
                          { name: 'Tabler Icons', url: 'https://tabler.io/icons', license: 'MIT' },
                          { name: 'Phosphor Icons', url: 'https://phosphoricons.com', license: 'MIT' },
                          { name: 'Heroicons', url: 'https://heroicons.com', license: 'MIT' },
                          { name: 'Bootstrap Icons', url: 'https://icons.getbootstrap.com', license: 'MIT' },
                          { name: 'Radix Icons', url: 'https://www.radix-ui.com/icons', license: 'MIT' },
                        ].map((lib) => (
                          <tr key={lib.name} className="border-b border-gray-100 dark:border-gray-800">
                            <td className="p-3 border border-gray-200 dark:border-gray-700">
                              <a href={lib.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">{lib.name}</a>
                            </td>
                            <td className="p-3 border border-gray-200 dark:border-gray-700">
                              <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-semibold">{lib.license}</span>
                            </td>
                            <td className="p-3 border border-gray-200 dark:border-gray-700 text-green-600 dark:text-green-400 font-medium">✓ Allowed</td>
                            <td className="p-3 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">Encouraged, not required</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    ℹ️ MIT/ISC licenses allow free use in any project, including commercial ones. Attribution is not a legal requirement, but is appreciated to support the open-source community.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. User Responsibilities</h2>
                  <p className="leading-relaxed mb-3">Users agree to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Comply with the applicable MIT/ISC license terms for downloaded icons</li>
                    <li>Include the original license file when redistributing icons</li>
                    <li>Not use the service for malicious purposes</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Disclaimer</h2>
                  <p className="leading-relaxed">
                    This service is provided "as is". Icony makes no warranties regarding the accuracy, reliability, or availability of the service,
                    and shall not be liable for any direct or indirect damages resulting from use of the service.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Privacy</h2>
                  <p className="leading-relaxed">
                    Icony does not collect personal information. Favorites and recent icons are stored only in your browser's local storage
                    and are not transmitted to external servers.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Service Modification and Termination</h2>
                  <p className="leading-relaxed">
                    Icony reserves the right to modify or terminate the service, in whole or in part, without prior notice.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Governing Law</h2>
                  <p className="leading-relaxed">
                    These terms shall be governed by and construed in accordance with the laws of the Republic of Korea.
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Last Updated: March 26, 2026
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
