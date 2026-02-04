import { useLanguage, Language } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ko' ? 'en' : 'ko');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Change language"
      title={`Switch to ${language === 'ko' ? 'English' : '한국어'}`}
    >
      <Globe size={16} />
      <span className="font-semibold">{language === 'ko' ? 'EN' : 'KO'}</span>
    </button>
  );
}
