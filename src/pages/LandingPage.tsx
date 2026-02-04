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

export function LandingPage() {
  const features = [
    {
      icon: Palette,
      title: 'Customize Colors',
      description: 'Choose any color with our intuitive color picker and see real-time preview',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Instant icon preview and download with optimized performance',
    },
    {
      icon: Download,
      title: 'Multiple Formats',
      description: 'Export your icons as PNG or SVG in any size from 16px to 512px',
    },
    {
      icon: Heart,
      title: 'Save Favorites',
      description: 'Mark your favorite icons and access them quickly anytime',
    },
    {
      icon: Clock,
      title: 'Recent History',
      description: 'Automatically tracks your recently used icons for easy access',
    },
    {
      icon: FileCode,
      title: 'Developer Friendly',
      description: 'Clean SVG code optimized for web and mobile applications',
    },
  ];

  const stats = [
    { value: '2,000+', label: 'Icons Available' },
    { value: '100%', label: 'Free Forever' },
    { value: '512px', label: 'Max Resolution' },
    { value: '67', label: 'Categories' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 via-purple-50 to-accent-100">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
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
          <Link
            to="/app"
            className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Launch App
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
            <Sparkles size={16} />
            <span>Free Icon Customization Tool</span>
          </div>

          <h1 className="text-6xl font-bold text-gray-900 leading-tight">
            Customize Icons
            <br />
            <span className="bg-gradient-to-r from-primary-700 to-accent-700 bg-clip-text text-transparent">
              In Seconds
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Choose from 2,000+ professional icons, customize colors and sizes,
            then download instantly in PNG or SVG format. Perfect for designers and developers.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              to="/app"
              className="group flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <span>Get Started Free</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-white text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-200 shadow-lg border-2 border-gray-200"
            >
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-primary-600">{stat.value}</div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to make icon customization effortless
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl shadow-2xl my-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Simple 3-Step Process
          </h2>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Get your customized icon in just three easy steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { step: '1', title: 'Choose Icon', desc: 'Browse 2,000+ icons across 67 categories' },
            { step: '2', title: 'Customize', desc: 'Pick colors, adjust size, preview instantly' },
            { step: '3', title: 'Download', desc: 'Export as PNG or SVG in any size' },
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
        <div className="max-w-3xl mx-auto space-y-8 p-12 bg-white rounded-3xl shadow-2xl border border-gray-100">
          <h2 className="text-4xl font-bold text-gray-900">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of designers and developers customizing icons with Icony
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Check className="text-green-500" size={20} />
              <span>No signup required</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Check className="text-green-500" size={20} />
              <span>100% free forever</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Check className="text-green-500" size={20} />
              <span>Instant download</span>
            </div>
          </div>

          <Link
            to="/app"
            className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-primary-700 to-accent-700 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 shadow-xl"
          >
            <span>Start Customizing Now</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-gray-200">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500">
              <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="12" fill="white"/>
                <circle cx="24" cy="24" r="6" fill="#3B82F6"/>
                <circle cx="24" cy="24" r="3" fill="white"/>
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-700">Icony</span>
          </div>

          <p className="text-gray-600 text-sm text-center">
            2,000+ icons • Free forever • Made with ❤️ for designers and developers
          </p>

          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">
              Icons provided by:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-gray-500">
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
                Lucide Icons (ISC License)
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
