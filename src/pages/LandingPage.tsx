import { Link } from 'react-router-dom';
import {
  Palette,
  Download,
  Zap,
  Heart,
  Clock,
  FileCode,
  Sparkles,
  ArrowRight,
  Check
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { ThemeToggle } from '../components/ThemeToggle';

export function LandingPage() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Palette,
      title: t.landing.features.customizeColors.title,
      description: t.landing.features.customizeColors.description,
    },
    {
      icon: Zap,
      title: t.landing.features.lightningFast.title,
      description: t.landing.features.lightningFast.description,
    },
    {
      icon: Download,
      title: t.landing.features.multipleFormats.title,
      description: t.landing.features.multipleFormats.description,
    },
    {
      icon: Heart,
      title: t.landing.features.saveFavorites.title,
      description: t.landing.features.saveFavorites.description,
    },
    {
      icon: Clock,
      title: t.landing.features.recentHistory.title,
      description: t.landing.features.recentHistory.description,
    },
    {
      icon: FileCode,
      title: t.landing.features.developerFriendly.title,
      description: t.landing.features.developerFriendly.description,
    },
  ];

  const stats = [
    { value: t.language === 'ko' ? '수천 개' : 'Thousands', label: t.landing.stats.icons },
    { value: '100%', label: t.landing.stats.free },
    { value: '512px', label: t.landing.stats.resolution },
    { value: '67', label: t.landing.stats.categories },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 via-purple-50 to-accent-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      {/* Header */}
      <header className="container mx-auto px-6 py-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl mt-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-500 shadow-lg">
              <svg className="w-6 h-6" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="12" fill="white"/>
                <circle cx="24" cy="24" r="6" fill="#3B82F6"/>
                <circle cx="24" cy="24" r="3" fill="white"/>
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-700 to-accent-700 bg-clip-text text-transparent">
              Icony
            </span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link
              to="/app"
              className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {t.landing.header.launchApp}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-full text-sm font-semibold transition-colors">
            <Sparkles size={16} />
            <span>{t.landing.tagline}</span>
          </div>

          <h1 className="text-6xl font-bold text-gray-900 dark:text-white leading-tight">
            {t.landing.hero.title}
            <br />
            <span className="bg-gradient-to-r from-primary-700 to-accent-700 bg-clip-text text-transparent">
              {t.landing.hero.subtitle}
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {t.landing.hero.description}
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              to="/app"
              className="group flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <span>{t.landing.hero.getStarted}</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-lg border-2 border-gray-200 dark:border-gray-700"
            >
              {t.landing.hero.learnMore}
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t.landing.features.title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t.landing.features.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 dark:from-primary-600 dark:to-accent-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-20 bg-gradient-to-br from-primary-500 to-accent-500 dark:from-primary-700 dark:to-accent-700 rounded-3xl shadow-2xl my-20 transition-colors">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            {t.landing.howItWorks.title}
          </h2>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            {t.landing.howItWorks.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { step: '1', title: t.landing.howItWorks.step1.title, desc: t.landing.howItWorks.step1.description },
            { step: '2', title: t.landing.howItWorks.step2.title, desc: t.landing.howItWorks.step2.description },
            { step: '3', title: t.landing.howItWorks.step3.title, desc: t.landing.howItWorks.step3.description },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-white text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-xl">
                {item.step}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-primary-100">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-8 p-12 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            {t.landing.cta.title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t.landing.cta.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Check className="text-green-500" size={20} />
              <span>{t.landing.cta.noSignup}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Check className="text-green-500" size={20} />
              <span>{t.landing.cta.free}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Check className="text-green-500" size={20} />
              <span>{t.landing.cta.instant}</span>
            </div>
          </div>

          <Link
            to="/app"
            className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-primary-700 to-accent-700 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 shadow-xl"
          >
            <span>{t.landing.cta.startNow}</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-gray-200 dark:border-gray-800">
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
              <Link
                to="/terms"
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors font-medium"
              >
                {t.language === 'ko' ? '이용 약관' : 'Terms & Conditions'}
              </Link>
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
    </div>
  );
}
