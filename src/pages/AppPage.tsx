import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useIconContext } from '../context/IconContext';
import { useLanguage } from '../context/LanguageContext';
import { Header } from '../components/Header';
import { MainLayout } from '../components/Layout/MainLayout';
import { OnboardingModal } from '../components/OnboardingModal';

export function AppPage() {
  const [searchParams] = useSearchParams();
  const { icons, selectIcon, setColor, setSize } = useIconContext();
  const { t } = useLanguage();
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check if onboarding has been completed
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('icony_onboarding_completed');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  // Load state from URL parameters
  useEffect(() => {
    const iconId = searchParams.get('icon');
    const colorParam = searchParams.get('color');
    const sizeParam = searchParams.get('size');

    if (iconId) {
      const icon = icons.find((i) => i.id === iconId);
      if (icon) {
        selectIcon(icon);
      }
    }

    if (colorParam) {
      setColor(`#${colorParam}`);
    }

    if (sizeParam) {
      const size = parseInt(sizeParam, 10);
      if (size >= 16 && size <= 512) {
        setSize(size);
      }
    }
  }, [searchParams, icons, selectIcon, setColor, setSize]);

  const handleHelpClick = () => {
    setShowOnboarding(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors flex flex-col">
      <Header onHelpClick={handleHelpClick} />
      <div className="flex-1">
        <MainLayout />
      </div>
      <footer className="container mx-auto px-6 py-12 border-t border-gray-200 dark:border-gray-800 transition-colors">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500">
              <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="12" fill="white"/>
                <circle cx="24" cy="24" r="6" fill="#3B82F6"/>
                <circle cx="24" cy="24" r="3" fill="white"/>
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-700 dark:text-gray-300">Icony</span>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
            {t.landing.footer.tagline}
          </p>

          <div className="text-center space-y-3">
            <div>
              <a
                href="/terms"
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors font-medium"
              >
                {t.language === 'ko' ? '이용 약관' : 'Terms & Conditions'}
              </a>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                {t.landing.footer.iconsBy}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-500">
                <a
                  href="https://fontawesome.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-600 transition-colors"
                >
                  Font Awesome Free 6.7.2 (CC BY 4.0)
                </a>
                <span className="text-gray-400">•</span>
                <a
                  href="https://lucide.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-600 transition-colors"
                >
                  Lucide Icons (ISC)
                </a>
                <span className="text-gray-400">•</span>
                <a
                  href="https://tabler.io/icons"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-600 transition-colors"
                >
                  Tabler Icons (MIT)
                </a>
                <span className="text-gray-400">•</span>
                <a
                  href="https://phosphoricons.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-600 transition-colors"
                >
                  Phosphor Icons (MIT)
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
    </div>
  );
}
