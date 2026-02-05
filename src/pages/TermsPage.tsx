import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { ThemeToggle } from '../components/ThemeToggle';

export function TermsPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <header className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-500 shadow-md">
                <svg className="w-6 h-6" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="12" fill="white"/>
                  <circle cx="24" cy="24" r="6" fill="#3B82F6"/>
                  <circle cx="24" cy="24" r="3" fill="white"/>
                </svg>
              </div>
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
                to="/"
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
                  <p className="leading-relaxed mb-3">본 서비스에서 제공하는 아이콘은 다음 라이선스를 따릅니다:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Font Awesome Free 6.7.2</strong>: CC BY 4.0 라이선스 - 상업적 이용 시 출처 표기 필수</li>
                    <li><strong>Lucide Icons</strong>: ISC 라이선스 - 자유로운 사용 가능</li>
                    <li><strong>Tabler Icons</strong>: MIT 라이선스 - 자유로운 사용 가능 (출처 표기 권장)</li>
                    <li><strong>Phosphor Icons</strong>: MIT 라이선스 - 자유로운 사용 가능 (출처 표기 권장)</li>
                  </ul>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    ⚠️ Font Awesome 아이콘 사용 시에는 반드시 출처를 표기해야 합니다. 나머지 라이브러리는 출처 표기가 필수는 아니지만 권장됩니다.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. 사용자 책임</h2>
                  <p className="leading-relaxed mb-3">사용자는 다음 사항에 동의합니다:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>다운로드한 아이콘의 라이선스 조건을 준수할 것</li>
                    <li>Font Awesome 아이콘 사용 시 적절한 출처 표기를 할 것 (필수)</li>
                    <li>MIT/ISC 라이선스 아이콘 사용 시 라이선스 조항을 준수할 것</li>
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
                    최종 업데이트: 2026년 2월 5일
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
                  <p className="leading-relaxed mb-3">Icons provided through this service are licensed under:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Font Awesome Free 6.7.2</strong>: CC BY 4.0 License - Attribution required for commercial use</li>
                    <li><strong>Lucide Icons</strong>: ISC License - Free to use</li>
                    <li><strong>Tabler Icons</strong>: MIT License - Free to use (attribution recommended)</li>
                    <li><strong>Phosphor Icons</strong>: MIT License - Free to use (attribution recommended)</li>
                  </ul>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    ⚠️ Attribution is required when using Font Awesome icons. For other libraries, attribution is recommended but not mandatory.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. User Responsibilities</h2>
                  <p className="leading-relaxed mb-3">Users agree to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Comply with the license terms of downloaded icons</li>
                    <li>Provide proper attribution when using Font Awesome icons (required)</li>
                    <li>Comply with MIT/ISC license terms when using other icon libraries</li>
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
                    Last Updated: February 5, 2026
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
