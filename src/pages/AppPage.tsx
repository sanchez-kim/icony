import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useIconContext } from '../context/IconContext';
import { Header } from '../components/Header';
import { MainLayout } from '../components/Layout/MainLayout';
import { OnboardingModal } from '../components/OnboardingModal';

export function AppPage() {
  const [searchParams] = useSearchParams();
  const { icons, selectIcon, setColor, setSize } = useIconContext();
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
      <footer className="container mx-auto px-6 py-8 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors">
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Icons provided by:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
            <a
              href="https://fontawesome.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Font Awesome Free 6.7.2 (CC BY 4.0)
            </a>
            <span className="text-gray-400">•</span>
            <a
              href="https://lucide.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Lucide Icons (ISC License)
            </a>
          </div>
        </div>
      </footer>
      <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
    </div>
  );
}
